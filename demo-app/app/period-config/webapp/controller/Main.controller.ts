import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import Input from "sap/m/Input";
import DatePicker from "sap/m/DatePicker";
import RowActionItem from "sap/ui/table/RowActionItem";
import Event from "sap/ui/base/Event";
import Fragment from "sap/ui/core/Fragment";
import Dialog from "sap/m/Dialog";
import formatter from "../model/formatter";
import { PeriodConfig } from "../model/period-config";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace hrcap.cts.periodconfig.periodconfig.controller
 */
export default class Main extends Controller {
  public formatter = formatter;

  private _createDialog: Dialog | null;

  public onInit(): void {
    this.getView()?.setModel(
      new JSONModel({
        busy: false,
      }),
      "view",
    );

    this.getView()?.setModel(
      new JSONModel({
        busy: false,
        rows: [],
        filters: {},
        limit: 10,
        offset: 0,
      }),
      "table",
    );
    void this._loadPeriodConfigs();
  }

  private setBusy(isBusy: boolean) {
    const viewModel = <JSONModel>this.getView()?.getModel("view");
    viewModel?.setProperty("/busy", isBusy);
  }

  // FILTER HANDLER
  private _getFilterValues(): Partial<PeriodConfig> {
    const filterBar = <FilterBar>this.byId("periodConfigFilterBar");
    if (!filterBar) return {};

    const filters: Partial<PeriodConfig> = {};
    const items = filterBar.getFilterGroupItems();

    items.forEach((item) => {
      const key = item.getName() as keyof PeriodConfig;
      const control = item.getControl() as Input | DatePicker | null;
      if (!control) return;

      const value = control.getValue().trim();

      if (value) {
        filters[key] = value;
      }
    });

    return filters;
  }

  public async onFilterChange() {
    const filters = this._getFilterValues();
    const tableModel = <JSONModel>this.getView()?.getModel("table");
    tableModel?.setProperty("/filters", filters);
    await this._loadPeriodConfigs();
  }

  private async _loadPeriodConfigs() {
    this.setBusy(true);
    const tableModel = <JSONModel>this.getView()?.getModel("table");
    tableModel.setProperty("/busy", true);

    try {
      const filters =
        <Partial<PeriodConfig>>tableModel.getProperty("/filters") || {};

      const limit = <number>tableModel.getProperty("/limit") || 10;
      const offset = <number>tableModel.getProperty("/offset") || 0;

      const params: string[] = [`limit=${limit}`, `offset=${offset}`];

      const appendStringParam = (name: keyof PeriodConfig) => {
        const raw = filters[name];
        if (!raw) return;
        const value = raw.toString().trim();
        if (!value) return;
        const escaped = value.replace(/'/g, "''");
        params.push(`${name}='${escaped}'`);
      };

      appendStringParam("payrollPeriod");
      appendStringParam("payrollPeriodFrom");
      appendStringParam("payrollPeriodTo");
      appendStringParam("confirmStartDate");
      appendStringParam("confirmEndDate");

      const response = await fetch(`/period/paginated(${params.join(",")})`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = <{ value?: PeriodConfig[] }>await response.json();
      tableModel.setProperty("/rows", data.value || []);
    } catch (error) {
      tableModel.setProperty("/rows", []);
      MessageBox.error(`Cannot load PeriodConfigs: ${String(error)}`);
    } finally {
      tableModel.setProperty("/busy", false);
      this.setBusy(false);
    }
  }

  // CREATE HANDLER
  public onCreatePress(): void {
    void this._openCreateDialog();
  }

  private async _openCreateDialog(data?: PeriodConfig): Promise<void> {
    if (!this._createDialog) {
      this._createDialog = <Dialog>await Fragment.load({
        id: this.getView()?.getId(),
        name: "hrcap.cts.periodconfig.periodconfig.view.CreateDialog",
        controller: this,
      });
      this.getView()?.addDependent(this._createDialog);
    }
    const dialogModel = new JSONModel({
      busy: false,
      periodConfig: {
        ID: data?.ID || "",
        payrollPeriod: data?.payrollPeriod || "",
        payrollPeriodFrom: data?.payrollPeriodFrom || "",
        payrollPeriodTo: data?.payrollPeriodTo || "",
        confirmStartDate: data?.confirmStartDate || "",
        confirmEndDate: data?.confirmEndDate || "",
      },
    });
    this._createDialog.setModel(dialogModel, "createDialog");
    this._createDialog.open();
  }

  public async onSaveCreate(): Promise<void> {
    const dialogModel = <JSONModel>this._createDialog?.getModel("createDialog");

    dialogModel.setProperty("/busy", true);
    try {
      const response = await fetch("/period/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          periodConfig: <PeriodConfig>dialogModel?.getProperty("/periodConfig"),
        }),
      });
      if (!response.ok) {
        throw new Error(`Save failed with status ${response.status}`);
      }
      this._createDialog?.close();
      MessageToast.show("Period config created successfully.");
      await this._loadPeriodConfigs();
    } catch (error) {
      MessageBox.error(`Cannot save: ${String(error)}`);
    } finally {
      dialogModel.setProperty("/busy", false);
    }
  }

  public onCancelCreate() {
    this._createDialog?.close();
  }

  // EDIT HANDLER
  public async onEditPress(event: Event) {
    const source = event.getSource<RowActionItem>();
    const context = source.getBindingContext("table");
    if (!context) return;
    const record = <PeriodConfig>context.getObject();
    await this._openCreateDialog(record);
  }

  // DELETE
  public onDeletePress(event: Event) {
    const source = event.getSource<RowActionItem>();
    const context = source.getBindingContext("table");
    if (!context) return;
    const record = <PeriodConfig>context.getObject();
    MessageBox.confirm(`Delete period "${record.payrollPeriod}"?`, {
      onClose: async (action: string) => {
        if (action === MessageBox.Action.OK.toString()) {
          await this._deletePeriodConfig(record.ID);
        }
      },
    });
  }

  private async _deletePeriodConfig(id: string): Promise<void> {
    this.setBusy(true);
    try {
      const response = await fetch(`/period/remove(ID='${id}')`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Delete failed with status ${response.status}`);
      }
      await this._loadPeriodConfigs();
      MessageToast.show("PeriodConfig deleted");
    } catch (error) {
      MessageBox.error(`Cannot delete: ${String(error)}`);
    } finally {
      this.setBusy(false);
    }
  }
}

import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import MessageBox from "sap/m/MessageBox";
import formatter from "../model/formatter";

/**
 * @namespace hrcap.cts.periodconfig.periodconfig.controller
 */
export default class Main extends Controller {
    public formatter = formatter;

    public onInit(): void {
        const tableModel = new JSONModel({
            busy: false,
            items: []
        });

        this.getView().setModel(tableModel, "table");
        void this._loadPeriodConfigs();
    }

    private async _loadPeriodConfigs(limit: number = 100): Promise<void> {
        const tableModel = this.getView().getModel("table") as JSONModel;
        tableModel.setProperty("/busy", true);

        try {
            const response = await fetch(`/period/paginated(limit=${limit})`, {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const data = await response.json() as { value?: unknown[] };
            tableModel.setProperty("/items", data.value ?? []);
        } catch (error) {
            tableModel.setProperty("/items", []);
            MessageBox.error(`Cannot load PeriodConfigs: ${String(error)}`);
        } finally {
            tableModel.setProperty("/busy", false);
        }

    }
}
import cds from "@sap/cds";

cds.once("served", async () => {
  const HrService = await cds.connect.to("HrService");
  const MssService = await cds.connect.to("MssService");

  if (HrService && MssService) {
    console.log("Mashing up services");
  }
});

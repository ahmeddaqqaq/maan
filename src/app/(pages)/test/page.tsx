"use client";

import AddNewAffiliatedCompaniesDialog from "../components/add-new-affiliated-companies-dialog";
import AddNewContractDialog from "../components/add-new-contract";
import AddNewMaterialDialog from "../components/add-new-material-dialog";
import AddNewMonthlyProductionDialog from "../components/add-new-monthly-production-dialog";
import AddNewWorkAreaDialog from "../components/add-new-work-area-dialog";
import DestructiveDialog from "../components/destructive-action-dialog";

export default function Test() {
  return (
    <div className="w-full h-full">
      <AddNewContractDialog />
      <DestructiveDialog description="the report 'Q1 Production Summary'" />
      <AddNewWorkAreaDialog />
      <AddNewMaterialDialog />
      <AddNewMonthlyProductionDialog />
      <AddNewAffiliatedCompaniesDialog />
    </div>
  );
}

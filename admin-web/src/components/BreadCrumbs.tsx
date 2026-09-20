import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

export interface BreadcrumbItemType {
  label: string;
  link: string;
}

interface BreadcrumbProps {
  breadcrumbs: BreadcrumbItemType[];
}

const BreadCrumbs = ({ breadcrumbs }: BreadcrumbProps) => {
  const nav = useNavigate();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbPage
                onClick={() => nav(crumb.link)}
                className="font-bold text-xl cursor-pointer hover:opacity-50"
              >
                {crumb.label}
              </BreadcrumbPage>
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;

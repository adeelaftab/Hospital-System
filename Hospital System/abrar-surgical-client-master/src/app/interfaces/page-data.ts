export interface IPageData {
  title: string;
  loaded?: boolean;
  breadcrumbs?: IBreadcrumb[];
  fullFilled?: boolean;
}

export interface IBreadcrumb {
  title: string;
  route?: string;
}

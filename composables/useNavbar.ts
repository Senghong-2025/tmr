import type { IRoute } from "~/models/route";

export default function useNavbar() {
  const { $auth } = useNuxtApp();

  const settingRoutes: IRoute[] = [
    {
      name: "Profile",
      path: "/setting/profile",
      component: "",
    },
    {
      name: "Category",
      path: "/setting/category",
      component: "",
    },
    {
      name: "Currency",
      path: "/setting/currency",
      component: "",
    },
  ];

  const isActived = (route: IRoute) => {
    return route.path === useRoute().path;
  };
  return {
    settingRoutes,
    isActived,
  };
}

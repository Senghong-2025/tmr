import type { IRoute } from "~/models/route";

export default function useNavbar() {
  const mainRoutes: IRoute[] = [
    {
      name: "Transaction",
      path: "/transaction",
      component: () => import("@/pages/transaction/index.vue"),
    },
    {
      name: "Setting",
      path: "/setting",
      component: () => import("@/pages/setting/profile.vue"),
    },
  ];
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

  const isActivedMainRoute = (route: IRoute) => useRoute().path.startsWith(route.path);

  return {
    settingRoutes,
    isActived,
    mainRoutes,
    isActivedMainRoute
  };
}

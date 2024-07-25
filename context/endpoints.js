const endpoints = {
   fetchIA: "/inventoryadjustment/all/adjustments",
   fetchDSD: "/dsd/all/Dsd",
   fetchPO: "/purchaseOrder/getall/po",

   fetchItemsIA: "/inventoryadjustment/products/id/",
   fetchItemsDSD: "/dsd/products/DsdNumber/",
   fetchItemsBySupplier: "/dsd/get/supplier/products/",

   createIA: "/inventoryadjustment/create/IA/",
   createDSD: "/dsd/create/Dsd/",

   deleteIA: "/inventoryadjustment/delete/byid/",
   deleteDSD: "/dsd/delete/byid/",

   searchIA: "/inventoryadjustment/search/adjustments/",
   searchDSD: "/dsd/getMatched/Dsd/",

   sortIA: "/inventoryadjustment/sort/",
   sortDSD: "/dsd/sort/",

   // fetchReasons:
   fetchSuppliers: "/dsd/getMatched/suppliers/",

   saveAsDraftIA: "/inventoryadjustment/saveAsDraft",
   saveAsDraftDSD: "/dsd/saveAsDraft",

   submitIA: "/inventoryadjustment/save/adj/products",
   submitDSD: "/dsd/save/Dsd/products",
};

export { endpoints };

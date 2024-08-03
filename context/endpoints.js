const endpoints = {
   fetchIA: "/inventoryadjustment/all/adjustments",
   fetchDSD: "/dsd/all/Dsd",
   fetchPO: "/purchaseOrder/getall/po",
   fetchReasons: "/inventoryadjustment/reasoncodes",
   fetchItemsIA: "/inventoryadjustment/products/id/",
   fetchItemsDSD: "/dsd/products/DsdNumber/",
   fetchItemsBySupplier: "/dsd/get/supplier/products/",
   fetchASNForPO: "/purchaseOrder/get/asn/list/by/ponumber/",
   fetchAsnItems: "/purchaseOrder/getitemsby/asnnumber/",
   fetchPoItems: "/purchaseOrder/get/itemBy/po/",

   generalItemSearch: "/product/getMatched/sku/",

   createIA: "/inventoryadjustment/create/IA/",
   createDSD: "/dsd/create/Dsd/",
   createAsn: "/purchaseOrder/create/asn",

   deleteIA: "/inventoryadjustment/delete/byid/",
   deleteDSD: "/dsd/delete/byid/",

   searchIA: "/inventoryadjustment/search/adjustments/",
   searchDSD: "/dsd/getMatched/Dsd/",
   searchPo: "/purchaseOrder/getMatched/Po/",

   sortIA: "/inventoryadjustment/sort/",
   sortDSD: "/dsd/sort/",

   fetchSupplierByNameOrId: "/dsd/getMatched/suppliers/",

   saveAsDraftIA: "/inventoryadjustment/saveAsDraft",
   saveAsDraftDSD: "/dsd/saveAsDraft",

   submitIA: "/inventoryadjustment/save/adj/products",
   submitDSD: "/dsd/save/Dsd/products",
   submitAsnItems: "/purchaseOrder/save/po_receive/",
   saveAsnItems: "/purchaseOrder/save/draft/po/",
};

export { endpoints };

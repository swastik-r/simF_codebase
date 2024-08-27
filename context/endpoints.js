const endpoints = {
   // LISTING DATA
   fetchIA: "/inventoryadjustment/all/adjustments",
   fetchDSD: "/dsd/all/Dsd",
   fetchPo: "/purchaseOrder/getall/po",
   fetchTsfIn: "/transferreceive/get/intransfers/",
   fetchTsfOut: "/transferreceive/get/outtransfers/",

   // ITEM SEARCH
   generalItemSearch: "/product/getMatched/sku/",
   storeItemDetails: "/store/getBuddyStoreProductDetails/",
   fetchVariants: "/product/getVariants/",

   // CREATE ENTRY
   createIA: "/inventoryadjustment/create/IA/",
   createDSD: "/dsd/create/Dsd/",
   createAsn: "/purchaseOrder/create/asn",
   createTsf: "/transferreceive/create/transfer/",

   // DELETE ENTRY
   deleteIA: "/inventoryadjustment/delete/byid/",
   deleteDSD: "/dsd/delete/byid/",

   // SEARCH ENTRY
   searchIA: "/inventoryadjustment/search/adjustments/",
   searchDSD: "/dsd/getMatched/Dsd/",
   searchPo: "/purchaseOrder/getMatched/Po/",

   // SORT ENTRY
   sortIA: "/inventoryadjustment/sort/",
   sortDSD: "/dsd/sort/",

   // SAVE ENTRY
   saveAsDraftIA: "/inventoryadjustment/saveAsDraft",
   saveAsDraftDSD: "/dsd/saveAsDraft",

   // SUBMIT ENTRY
   submitIA: "/inventoryadjustment/save/adj/products",
   submitDSD: "/dsd/save/Dsd/products",
   submitAsnItems: "/purchaseOrder/save/po_receive/",
   saveAsnItems: "/purchaseOrder/save/draft/po/",

   // MODULE-SPECIFIC DATA
   fetchReasons: "/inventoryadjustment/reasoncodes",
   fetchTsfReasons: "/transferreceive/get/reasoncodes",
   fetchItemsIA: "/inventoryadjustment/products/id/",
   fetchItemsDSD: "/dsd/products/DsdNumber/",
   fetchItemsTsf: "/transferreceive/getProducts/byTransferid/",
   fetchItemsBySupplier: "/dsd/get/supplier/products/",
   fetchASNForPO: "/purchaseOrder/get/asn/list/by/ponumber/",
   fetchAsnItems: "/purchaseOrder/getitemsby/asnnumber/",
   fetchPoItems: "/purchaseOrder/get/itemBy/po/",
   fetchSupplierByNameOrId: "/dsd/getMatched/suppliers/",
   fetchStores: "/store/getMatched/stores/",
   getAllBuddyStores: "/store/get/all/buddystores/",
   fetchCurrentDetails: "/product/getProductDetailsByVariants",

   // TSF
   requestTsf: "/transferreceive/add/tsf/products",
   receiveTsf: "/transferreceive/receive/transfer",
   tsfAcceptance: "/transferreceive/update/orderAcceptance",
   shipTsf: "/transferreceive/ship/tsf/",
};

export { endpoints };

const endpoints = {
   // Inventory Adjustment

   fetchIa: "/inventoryadjustment/all/adjustments",
   createIA: "/inventoryadjustment/create/IA/",
   searchIA: "/inventoryadjustment/search/adjustments/",
   deleteIA: "/inventoryadjustment/delete/byid/",
   sortIA: "/inventoryadjustment/sort/",
   saveAsDraftIA: "/inventoryadjustment/saveAsDraft",
   submitIA: "/inventoryadjustment/save/adj/products",
   fetchItemsIA: "/inventoryadjustment/products/id/",

   // Direct Store Delivery

   fetchDsd: "/dsd/all/Dsd",
   createDSD: "/dsd/create/Dsd/",
   deleteDSD: "/dsd/delete/byid/",
   searchDSD: "/dsd/getMatched/Dsd/",
   sortDSD: "/dsd/sort/",
   filterDSD: "/dsd/filter/Dsd/",
   saveAsDraftDSD: "/dsd/saveAsDraft",
   submitDSD: "/dsd/save/Dsd/products",
   fetchItemsDSD: "/dsd/products/DsdNumber/",
   fetchItemsBySupplier: "/dsd/get/supplier/products/",
   fetchSupplierByNameOrId: "/dsd/getMatched/suppliers/",

   // Transfers

   fetchTsfIn: "/transferreceive/get/intransfers/",
   fetchTsfOut: "/transferreceive/get/outtransfers/",
   searchTsfIn: "/transferreceive/search/In/Tsf/",
   searchTsfOut: "/transferreceive/search/Out/Tsf/",
   sortTsf: "/transferreceive/sort/",
   filterTsf: "/transferreceive/filter/",
   createTsf: "/transferreceive/create/transfer/",
   fetchTsfReasons: "/transferreceive/get/reasoncodes",
   fetchItemsTsf: "/transferreceive/getProducts/byTransferid/",
   requestTsf: "/transferreceive/add/tsf/products",
   receiveTsf: "/transferreceive/receive/transfer",
   tsfAcceptance: "/transferreceive/update/orderAcceptance",
   shipTsf: "/transferreceive/ship/tsf/",
   createAsn: "/purchaseOrder/create/asn",
   fetchAsnItems: "/purchaseOrder/getitemsby/asnnumber/",

   // Purchase Order

   fetchPo: "/purchaseOrder/getall/po",
   searchPo: "/purchaseOrder/getMatched/Po/",
   sortPo: "/purchaseOrder/sort/",
   submitAsnItems: "/purchaseOrder/save/po_receive/",
   saveAsnItems: "/purchaseOrder/save/draft/po/",
   fetchASNForPO: "/purchaseOrder/get/asn/list/by/ponumber/",
   fetchPoItems: "/purchaseOrder/get/itemBy/po/",

   // Stock Count

   fetchSc: "/stockcount/all/StockCounts",
   createSc: "/stockcount/Create/AdhocstockCount/",
   fetchScItems: "/stockcount/products/id/",
   fetchScReasons: "/stockcount/reasoncodes",
   fetchScEntry: "/stockcount/products/id/",
   addItemsToSc: "/stockcount/add/AdhocProducts",
   draftSc: "/stockcount/draft/SC/adhoc",

   // Return to Vendor

   fetchRtv: "/returntovendor/all/rtv",
   sortRtv: "/returntovendor/sort/",

   // Miscellaneous Endpoints

   generalItemSearch: "/product/getMatched/sku/",
   storeItemDetails: "/store/getBuddyStoreProductDetails/",
   fetchVariants: "/product/getVariants/",
   fetchReasons: "/inventoryadjustment/reasoncodes",
   fetchStores: "/store/getMatched/stores/",
   getAllBuddyStores: "/store/get/all/buddystores/",
   fetchCurrentDetails: "/product/getProductDetailsByVariants",
   getAllCategories: "/product/getall/categories",
   searchCatItems: "/product/getMatched/sku/byCategory/",

   // Dashboard

   fetchMyTasks: "/sim/dashboard/getMyTasks/",
   fetchDiscrepancyTypeRatio: "/sim/dashboard/getCategoryWiseVariance/",
   fetchTransfersStatus: "/sim/dashboard/getTransferStatus/",
};

export { endpoints };

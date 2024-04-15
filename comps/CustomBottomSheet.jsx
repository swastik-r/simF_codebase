import React from "react";
import { ListItem, BottomSheet, Icon } from "@rneui/themed";
import { useAdjustmentDetail } from "../context/DataContext";

function CustomBottomSheet({ isVisible, setIsVisible, opts, func }) {
   const { pushFilterParams } = useAdjustmentDetail();
   return (
      <BottomSheet
         isVisible={isVisible}
         onBackdropPress={() => setIsVisible(false)}
      >
         {opts.map((opt, i) => (
            <ListItem
               key={i}
               containerStyle={opt.containerStyle}
               onPress={() => {
                  if (opt.sortType) {
                     func(opt.sortType);
                  } else {
                     pushFilterParams(opt.filterType);
                  }
                  setIsVisible(false);
               }}
            >
               <ListItem.Content>
                  <Icon {...opt.icon} />
                  <ListItem.Title style={opt.titleStyle}>
                     {opt.title}
                  </ListItem.Title>
               </ListItem.Content>
            </ListItem>
         ))}
      </BottomSheet>
   );
}

function SortBottomSheet() {
   const { sortOpts, sortByDate } = useAdjustmentDetail();
   return <CustomBottomSheet opts={sortOpts} func={sortByDate} />;
}

function FilterBottomSheet() {
   const { filterOpts, filterData } = useAdjustmentDetail();
   return <CustomBottomSheet opts={filterOpts} func={filterData} />;
}

function StatusFilterBottomSheet() {
   const { statusFilterOpts, filterStatus } = useAdjustmentDetail();
   return <CustomBottomSheet opts={statusFilterOpts} func={filterStatus} />;
}

function ReasonFilterBottomSheet() {
   const { reasonFilterOpts, filterReason } = useAdjustmentDetail();
   return <CustomBottomSheet opts={reasonFilterOpts} func={filterReason} />;
}

// function DateFilterBottomSheet({ dateFilterOpts, func }) {
//    return <CustomBottomSheet opts={dateFilterOpts} func={func} />;
// }

export {
   CustomBottomSheet,
   SortBottomSheet,
   FilterBottomSheet,
   StatusFilterBottomSheet,
   ReasonFilterBottomSheet,
};

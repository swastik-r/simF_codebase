import { ListItem, BottomSheet, Icon, Overlay } from "@rneui/themed";
import { useAdjustmentDetail } from "../context/DataContext";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

// ----------------- SORT BottomSheet -----------------

function SortBottomSheet({ isVisible, setIsVisible }) {
   // States and Vars
   const sortOpts = [
      {
         title: "Sort by",
         titleStyle: {
            fontFamily: "Montserrat-Regular",
            fontSize: 25,
         },
         containerStyle: [styles.sortOptContainer, { paddingTop: 0 }],
      },
      {
         title: "Sort by latest",
         icon: {
            name: "sort-clock-descending-outline",
            type: "material-community",
            color: "black",
            size: 35,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         sortType: "latest",
      },
      {
         title: "Sort by oldest",
         icon: {
            name: "sort-clock-descending-outline",
            type: "material-community",
            color: "black",
            size: 35,
            containerStyle: {
               transform: [{ scaleY: -1 }],
            },
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.sortOptContainer,
         sortType: "oldest",
      },
      {
         title: sortApplied ? "Reset Sort" : "Cancel",
         icon: sortApplied
            ? { name: "refresh", type: "material", color: "white" }
            : { name: "cancel", type: "material", color: "white" },
         containerStyle: [
            styles.sortOptContainer,
            { backgroundColor: "darkred" },
         ],
         titleStyle: styles.sortOptCancel,
         sortType: "reset",
      },
   ];

   // Functions
   function sortByDate(sortType) {
      if (sortType === "reset") {
         resetSort();
         return;
      }

      const sortedData = [...data];
      sortedData.sort((a, b) => {
         const dateA = new Date(a.date);
         const dateB = new Date(b.date);
         return sortType === "latest" ? dateB - dateA : dateA - dateB;
      });

      setData(sortedData);
      setSortApplied(true);
      console.log("Sorted by: " + sortType);
   }

   function resetSort() {
      setData(initialData);
      setSortApplied(false);
   }

   return (
      <BottomSheet
         isVisible={isVisible}
         onBackdropPress={() => setIsVisible(false)}
      >
         {sortOpts.map((opt, i) => (
            <ListItem
               key={i}
               containerStyle={opt.containerStyle}
               onPress={() => {
                  sortByDate(opt.sortType);
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

// ----------------- FILTER BottomSheets --------------

function FilterBottomSheet({ isVisible, setIsVisible }) {
   // States and Vars
   const { filterOpts } = useAdjustmentDetail();

   return (
      <BottomSheet
         isVisible={isVisible}
         onBackdropPress={() => setIsVisible(false)}
      >
         {filterOpts.map((opt, i) => (
            <ListItem
               key={i}
               containerStyle={opt.containerStyle}
               onPress={() => {
                  if (opt.title === "Status") {
                     // open the StatusFilterBottomSheet
                  } else if (opt.title === "Reason") {
                     // open the ReasonFilterBottomSheet
                  } else if (opt.title === "Date") {
                     // open the DateFilterBottomSheet
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

function StatusFilterBottomSheet({ isVisible, setIsVisible }) {
   const { statusFilterOpts, filterStatus } = useAdjustmentDetail();
   return (
      <CustomBottomSheet
         isVisible={isVisible}
         setIsVisible={setIsVisible}
         opts={statusFilterOpts}
         func={filterStatus}
      />
   );
}

function ReasonFilterBottomSheet({ isVisible, setIsVisible }) {
   const { reasonFilterOpts, filterReason } = useAdjustmentDetail();
   return (
      <CustomBottomSheet
         isVisible={isVisible}
         setIsVisible={setIsVisible}
         opts={reasonFilterOpts}
         func={filterReason}
      />
   );
}

// Needs to be developed, later
function DateFilterBottomSheet({
   isVisible,
   setIsVisible,
   dateFilterOpts,
   func,
}) {
   // use date-time-picker here
   return (
      <Overlay
         isVisible={true}
         onBackdropPress={() => {
            // setIsVisible(false);
         }}
      >
         <Text>DateTimePicker</Text>
         <DateTimePickerAndroid />
      </Overlay>
   );
}

export {
   SortBottomSheet,
   FilterBottomSheet,
   StatusFilterBottomSheet,
   ReasonFilterBottomSheet,
};

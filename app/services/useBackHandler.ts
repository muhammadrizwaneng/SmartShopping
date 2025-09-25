// useBackHandler.js
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

export const useBackHandler = (refRBSheet) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    // Define the back button press action
    const backAction = () => {
      if (isSheetOpen) {
        refRBSheet.current.close(); // Close the bottom sheet if it's open
        setIsSheetOpen(false); // Update state to reflect that the sheet is closed
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup the listener on unmount
  }, [isSheetOpen]);

  // Function to track when the bottom sheet opens/closes
  const handleOpen = () => setIsSheetOpen(true);
  const handleClose = () => setIsSheetOpen(false);

  return { handleOpen, handleClose };
};

import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    isAuthPopupOpen: false,
    isSidebarOpen: false,
    isSearchBarOpen: false,
    isCartOpen: false,
    isAIPopupOpen: false,
    isProfilePanelOpen: false,
  },
  reducers: {
    toggleAuthPopup: (state) => {
      state.isAuthPopupOpen = !state.isAuthPopupOpen;
    },
    toggleLoginModal: (state) => {
      state.isAuthPopupOpen = !state.isAuthPopupOpen;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    toggleSearchBar: (state) => {
      state.isSearchBarOpen = !state.isSearchBarOpen;
    },
    toggleSearchOverlay: (state) => {
      state.isSearchBarOpen = !state.isSearchBarOpen;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    toggleAIModal: (state) => {
      state.isAIPopupOpen = !state.isAIPopupOpen;
    },
    toggleProfilePanel: (state) => {
      state.isProfilePanelOpen = !state.isProfilePanelOpen;
    },
  },
});

export const {
  toggleAuthPopup,
  toggleLoginModal,
  toggleSidebar,
  toggleSearchBar,
  toggleSearchOverlay,
  toggleCart,
  toggleAIModal,
  toggleProfilePanel,
} = popupSlice.actions;
export default popupSlice.reducer;

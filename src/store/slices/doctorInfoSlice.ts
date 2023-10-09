import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DoctorInfo } from "../types/chatTypes";

interface ChatInfoDocSliceState {
  doctorInfo: DoctorInfo | null;
}

const initialState: ChatInfoDocSliceState = {
  doctorInfo: null,
};

const doctorInfoSlice = createSlice({
  name: "doctorInfo",
  initialState,
  reducers: {
    addDoctorInfo: (state, action: PayloadAction<DoctorInfo>) => {
      state.doctorInfo = action.payload;
    },
  },
});

export const { addDoctorInfo } = doctorInfoSlice.actions;

export default doctorInfoSlice.reducer;

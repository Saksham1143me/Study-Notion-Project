import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step:
    // localStorage.getItem("step")
  // ? JSON.parse(localStorage.getItem("step"))
  // :
   1,
  course: null,
  editingCourse: false,
  paymentLoading: false,
}

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
    setCourse: (state, action) => {
      state.course = action.payload
    },
    setEditingCourse: (state, action) => {
      state.editingCourse = action.payload
    },
    setPaymentLoading: (state, action) => {
      state.paymentLoading = action.payload
    },
    resetCourseState: (state) => {
      state.step = 1
      state.course = null
      state.editingCourse = false
    },
  },
})

export const {
  setStep,
  setCourse,
  setEditingCourse,
  setPaymentLoading,
  resetCourseState,
} = courseSlice.actions

export default courseSlice.reducer

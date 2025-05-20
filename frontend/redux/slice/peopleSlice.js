import { DEPLOYED_URL } from "@/utils/constants";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  questionsByTestId: [],
};

export const personDataAsync = createAsyncThunk(
  "person/data",
  async (application_id) => {
    const response = await axios.get(
      `${DEPLOYED_URL}/application/${application_id}`
    );
    const questionsByTestId = await axios.get(
      `${DEPLOYED_URL}/question/test/${response.data[0].test_id}`
    );
    console.log("INSIDE THUNK", questionsByTestId.data);
    return questionsByTestId.data;
  }
);

const peopleSlice = createSlice({
  name: "peopleData",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPerson: (state, action) => {
      state.person = action.payload;
      // console.log("state", state.person);
    },
    updatePersonInfo: (state, action) => {
      const { key, value, index } = action.payload;
      state.person[index][key] = value;
    },
    updatePerson: (state, action) => {
      const { key, value } = action.payload;
      state.person[key] = value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(personDataAsync.fulfilled, (state, action) => {
      state.questionsByTestId = action.payload.map((question, index) => {
        return {
          key: index,
          id: question.id,
          questionDesc: question.description,
          marks: question.marks,
          test_id: question.test_id,
          option: question.options.map((element) => ({
            optionId: element.id,
            optionDescription: element.description,
            is_answer: element.is_answer,
          })),
        };
      });
      console.log("REDUX-----------------", state.questionsByTestId);
    });
  },
});

export default peopleSlice.reducer;
export const peopleAction = peopleSlice.actions;

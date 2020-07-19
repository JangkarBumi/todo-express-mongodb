import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/api';

export const initialState = {
  todos: [],
  todo: null,
  loading: true,
  error: {},
};

export const addTodo = createAsyncThunk(
  'todos/addTodoStatus',

  async (title) => {
    const body = { title: title };
    const res = await api.post(`/todos`, body);
    return res.data;
  },
);

export const removeTodo = createAsyncThunk(
  'todos/removeTodoStatus',

  async (id) => {
    const res = await api.delete(`/todos/${id}`);
    return id;
  },
);


const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    getTodos: (state) => {
      state.loading = true;
    },
    getTodosSuccess: (state, { payload }) => {
      state.todos = payload;
      state.loading = false;
      state.hasErrors = false;
    },
    getTodosFailure: (state) => {
      state.loading = false;
      state.hasErrors = true;
    },
    addTodoSuccess: (state) => {
      state.loading = false;
      state.hasErrors = false;
    },
    updateTodoSuccess: (state, { payload }) => {

      state.todos = state.todos.map((item) => {

        if (item._id === payload.id) {
          return {
            ...item,
            title: payload.title,
            isCompleted: payload.isCompleted,
          };
        }
        return item;
      });
      state.loading = false;
      state.hasErrors = false;
    },
  },
  extraReducers: {
    [addTodo.fulfilled]: (state, action) => {
      state.todos.push(action.payload);
    },
    [removeTodo.fulfilled]: (state, action) => {
      state.todos.filter((todo) => todo._id !== action.payload);
    },
    // [updateTodo.fulfilled]: (state, action) => {
    //   console.log(action.payload);
    // },
  },
});

export const {
  getTodos,
  getTodosSuccess,
  getTodosFailure,
  addTodoSuccess,
  addTodos,
  updateTodoSuccess,
} = todosSlice.actions;

export const TodosSelector = (state) => state.todos;

export default todosSlice.reducer;

export const fetchTodos = () => async (dispatch) => {
  dispatch(getTodos());
  try {
    const res = await api.get(`/todos`);

    dispatch(getTodosSuccess(res.data));
  } catch (error) {
    dispatch(getTodosFailure());
  }
};

export const updateTodo = (id, title, isCompleted) => async (dispatch) => {
  const body = { title, isCompleted };
  try {
    const res = await api.put(`/todos/${id}`, body);

    const params = {id, title, isCompleted};
    dispatch(updateTodoSuccess(params));
  } catch (error) {
    console.log(error);
  }
};

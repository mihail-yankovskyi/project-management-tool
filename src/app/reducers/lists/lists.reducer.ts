import { createReducer, on } from '@ngrx/store';
import { getLists, getListsFailed, getListsSuccess, setListsLoading, updateListsTitlesSuccess } from './lists.actions';
import { IList } from '../../shared/interfaces/task-item.interface';

export interface ITodo {
  id: number;
  text: string;
}

export interface IListsState {
  allLists: IList[];
  isLoading: boolean;
}

export const initialListsState: IListsState = {
  allLists: [],
  isLoading: true
};

export const listsReducer = createReducer(
  initialListsState,
  on(getLists, (state) => ({
    ...state,
    isLoading: true
  })),
  on(getListsSuccess, (state, { lists }) => ({
    ...state,
    allLists: lists,
    isLoading: false
  })),
  on(getListsFailed, (state) => ({
    ...state,
    isLoading: false
  })),
  on(updateListsTitlesSuccess, (state, { updates }) => {
    const allLists = state.allLists.map(list => {
      const update = updates.find(u => u.id === list.id);
      return update ? { ...list, title: update.title } : list;
    });

    return {
      ...state,
      allLists
    }
  }),
  on(setListsLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  })),
);

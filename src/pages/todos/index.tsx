import { useEffect } from "react";
import type { NextPage } from "next";
import {
  wrapper,
  useAppDispatch,
  useAppSelector,
  AppDispatch,
  AppGetState,
} from "store/index";
import {
  removeAllTodos,
  onTodoDragEnd,
  fetchTodos,
} from "store/todo_board/reducers/todosReducer";
import {
  selectColumnsNames,
  selectColumns,
} from "store/todo_board/reducers/columnsReducer";
import { DragDropContext } from "react-beautiful-dnd";
import { Button } from "components/shared/ui-kit/index";
import { CreateColumnForm } from "components/pages/@todos/forms/CreateColumnForm";
import { CreateTodoForm } from "components/pages/@todos/forms/CreateTodoForm";
import { TodoColumn } from "components/pages/@todos/TodoColumn";
import {
  getTodos,
  getRunningOperationPromises,
  prefetch,
} from "store/todo_board/api";
import { selectTodosQueryVariables } from "store/todo_board/reducers/apiReducer";

const TodosPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectColumns);
  const columnsNames = useAppSelector(selectColumnsNames);
  const todosQueryVariables = useAppSelector(selectTodosQueryVariables);
  const prefetchTodos = () =>
    prefetch("getTodos", todosQueryVariables, { force: true });

  useEffect(() => {
    dispatch(fetchTodos());
    // eslint-disable-next-line
  }, []);

  return (
    <div className="text-xl px-8 min-w-[900px] max-w-[1320px] mx-[auto] h-[100vh]">
      <div className="flex justify-between h-[80px] py-5">
        <div className="flex gap-4">
          <CreateTodoForm />
          <CreateColumnForm />
        </div>
        <div>
          <Button
            onClick={() => dispatch(fetchTodos())}
            className="mr-5"
            onMouseEnter={() => dispatch(prefetchTodos())}
            disabled={columns.awaiting.meta.isLoading}
          >
            Fetch random todos
          </Button>
          <Button onClick={() => dispatch(removeAllTodos())} variant="danger">
            Remove all todos
          </Button>
        </div>
      </div>
      <div className="h-[calc(100%-100px)]">
        <DragDropContext
          onDragEnd={(result) => {
            if (result.destination) {
              dispatch(
                onTodoDragEnd({
                  id: result.draggableId,
                  destination: result.destination,
                  source: result.source,
                })
              );
            }
          }}
        >
          <div className="flex gap-4 height-[100%] pb-4 overflow-x-scroll">
            {columnsNames.map((columnName, idx) => (
              <TodoColumn
                {...columns[columnName]}
                name={columnName}
                key={idx}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  ({ dispatch, getState }: { dispatch: AppDispatch; getState: AppGetState }) =>
    async () => {
      const state = getState();

      dispatch(
        getTodos.initiate({
          page: state.todo_board.api.todos.page,
          limit: state.todo_board.api.todos.limit,
        })
      );

      await Promise.all(getRunningOperationPromises());

      return {
        props: {},
      };
    }
);

export default TodosPage;

import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "store/index";
import {
  removeAllTodos,
  selectTodos,
  fetchTodos,
  onTodoDragEnd,
} from "store/todo_board/reducers/todosReducer";
import { selectColumnNames } from "store/todo_board/reducers/columnsReducer";
import { DragDropContext } from "react-beautiful-dnd";
import { Button } from "components/shared/ui-kit/index";
import { CreateColumnForm } from "components/pages/@todos/forms/CreateColumnForm";
import { CreateTodoForm } from "components/pages/@todos/forms/CreateTodoForm";
import { TodoColumn } from "components/pages/@todos/TodoColumn";

const TodosPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const todoColumnNames = useAppSelector(selectColumnNames);

  return (
    <div className="px-8 text-xl">
      <div className="flex items-start justify-between my-5">
        <div className="flex gap-4">
          <CreateTodoForm />
          <CreateColumnForm />
        </div>
        <div className="flex">
          <Button onClick={() => dispatch(fetchTodos())} className="mr-5">
            Fetch random todos
          </Button>
          <Button onClick={() => dispatch(removeAllTodos())}>
            Remove all todos
          </Button>
        </div>
      </div>
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
        <div className="flex gap-4 mt-4">
          {todoColumnNames.map((columnName, idx) => (
            <TodoColumn {...todos[columnName]} name={columnName} key={idx} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TodosPage;

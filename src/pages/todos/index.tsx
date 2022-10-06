import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "store/index";
import { removeAllTodos, selectTodos } from "store/todos/slice";
import { DragDropContext } from "react-beautiful-dnd";
import { Button } from "components/shared/ui-kit/index";
import { CreateColumnForm } from "components/pages/@todos/forms/CreateColumnForm";
import { CreateTodoForm } from "components/pages/@todos/forms/CreateTodoForm";
import { fetchTodos, todoDragEnd } from "store/todos/slice";
import { TodoColumn } from "components/pages/@todos/TodoColumn";

const TodosPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

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
              todoDragEnd({
                id: result.draggableId,
                destination: result.destination,
                source: result.source,
              })
            );
          }
        }}
      >
        <div className="flex gap-4 mt-4">
          {Object.keys(todos).map((type, idx) => (
            <TodoColumn {...todos[type]} type={type} key={idx} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TodosPage;

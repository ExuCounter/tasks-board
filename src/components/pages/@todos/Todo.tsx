import { useAppDispatch } from "store/index";
import { Button, Text } from "components/shared/ui-kit/index";
import { removeTodo } from "store/todo_board/reducers/todosReducer";
import classNames from "classnames";
import type { TodoType } from "store/todo_board/types";

export const Todo = ({
  todo,
  isDragging,
}: {
  todo: TodoType;
  isDragging: boolean;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="pb-5">
      <div
        className={classNames(
          "flex justify-between items-center bg-white transition-colors rounded-md p-3 border-transparent",
          { "bg-cyan-50 border-2 border-slate-200": isDragging }
        )}
      >
        <Text className="px-3" fontSize="xs">
          {todo.description}
        </Text>
        <Button
          onClick={() => dispatch(removeTodo({ id: todo.id }))}
          variant="danger"
          sizing="sm"
          ghost
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

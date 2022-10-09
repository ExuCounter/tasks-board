import { useAppDispatch } from "store/index";
import { Button, Text } from "components/shared/ui-kit/index";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import {
  completeTodo,
  removeTodo,
} from "store/todo_board/reducers/todosReducer";
import classNames from "classnames";
import type { TodoType } from "store/todo_board/types";

export const Todo = ({
  todo,
  isDragging,
  completable = false,
}: {
  todo: TodoType;
  isDragging: boolean;
  completable?: boolean;
}) => {
  const dispatch = useAppDispatch();

  console.log(completable);

  return (
    <div className="pb-5 select-none">
      <div
        className={classNames(
          "flex justify-between items-center bg-white transition-colors rounded-md p-3 border-transparent",
          { "bg-cyan-50 border-2 border-slate-200": isDragging }
        )}
      >
        <Text className="px-3" fontSize="xs">
          {todo.description}
        </Text>
        <div className="flex">
          {completable && (
            <Button
              onClick={() => dispatch(completeTodo({ id: todo.id }))}
              variant="danger"
              sizing="sm"
              ghost
            >
              <CheckIcon width={16} height={16} />
            </Button>
          )}
          <Button
            onClick={() => dispatch(removeTodo({ id: todo.id }))}
            variant="danger"
            sizing="sm"
            ghost
          >
            <XMarkIcon color="red" width={16} height={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

import { useQueryState, parseAsBoolean } from "nuqs";

export const useCreateModal = (name: string) => {
  const [isOpen, setIsOpen] = useQueryState(
    name,
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};

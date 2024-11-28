"use client";

import { useCreateModal } from "@/features/hooks/use-create-modal";

import { ResponsiveModal } from "@/components/responsive-modal";

import { CreateProjectForm } from "./create-project-form";

export const CreateProjectModal = () => {
  const { isOpen, close, setIsOpen } = useCreateModal("project");

  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};

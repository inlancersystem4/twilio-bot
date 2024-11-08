import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export function AlertDialog({ isOpen, toggle }) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => toggle(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 bg-white bg-opacity-10 border border-solid border-white border-opacity-20 rounded-lg p-4">
          <div className="space-y-1">
            <DialogTitle className="font-bold text-red-600">
              Delete account
            </DialogTitle>
            <Description className="dark:text-white">
              Are you sure you want to delete this account?
            </Description>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => toggle(false)}>Cancel</button>
            <button onClick={() => toggle(true)}>Delete</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

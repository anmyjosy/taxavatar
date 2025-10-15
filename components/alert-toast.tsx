'use client';

import { ReactNode } from 'react';
import { toast as sonnerToast } from 'sonner';
import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ToastProps {
  id: string | number;
  title: ReactNode;
  description?: ReactNode;
}

interface ToastAlertOptions {
  title?: ReactNode;
  description?: ReactNode;
}

export function toastAlert(options: ToastAlertOptions = {}) {
  const { title = 'Agent Connection Error', description } = options;
  return sonnerToast.custom(
    (id) => <AlertToast id={id} title={title} description={description} />,
    { duration: 5_000 }
  );
}

function AlertToast(props: ToastProps) {
  const { title, id, description } = props;

  return (
    <Alert onClick={() => sonnerToast.dismiss(id)} className="bg-accent">
      <WarningIcon weight="bold" />
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  );
}

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  File as FileIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ScanLine,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency, formatDate } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { receiptsService } from '@/services/receipts.service';
import type { ReceiptUpload } from '@/types/domain';

export function ReceiptUpload({ className }: { className?: string }) {
  const [dragging, setDragging] = React.useState(false);
  const [uploads, setUploads] = React.useState<ReceiptUpload[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    for (const file of list) {
      const id = `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setUploads((prev) => [
        ...prev,
        {
          id,
          fileName: file.name,
          fileSize: file.size,
          status: 'uploading',
          progress: 0,
        },
      ]);

      try {
        const result = await receiptsService.upload(file, (progress) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === id
                ? {
                    ...u,
                    progress,
                    status: progress >= 100 ? 'processing' : 'uploading',
                  }
                : u
            )
          );
        });
        setUploads((prev) => prev.map((u) => (u.id === id ? result : u)));
        toast.success('Receipt processed');
      } catch {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id
              ? { ...u, status: 'failed', error: 'OCR processing failed' }
              : u
          )
        );
        toast.error('Failed to process receipt');
      }
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const retry = async (id: string) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'processing', progress: 0 } : u))
    );
    try {
      const result = await receiptsService.retry(id);
      setUploads((prev) => prev.map((u) => (u.id === id ? result : u)));
      toast.success('Receipt processed');
    } catch {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: 'failed', error: 'Retry failed' } : u
        )
      );
    }
  };

  const remove = (id: string) =>
    setUploads((prev) => prev.filter((u) => u.id !== id));

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload receipt — drag and drop or click to browse"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          dragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        <motion.div
          animate={dragging ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }}
          className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"
        >
          <UploadCloud className="h-7 w-7" />
        </motion.div>
        <p className="text-sm font-semibold">
          {dragging ? 'Drop your receipt here' : 'Drag & drop a receipt'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or click to browse — PNG, JPG, PDF up to 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Upload list */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {uploads.map((u) => (
              <motion.li
                key={u.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <UploadItem item={u} onRetry={() => retry(u.id)} onRemove={() => remove(u.id)} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function UploadItem({
  item,
  onRetry,
  onRemove,
}: {
  item: ReceiptUpload;
  onRetry: () => void;
  onRemove: () => void;
}) {
  const statusConfig = {
    uploading: {
      icon: <Loader2 className="h-4 w-4 animate-spin text-primary" />,
      label: `Uploading… ${item.progress}%`,
      barColor: 'bg-primary',
    },
    processing: {
      icon: <ScanLine className="h-4 w-4 animate-pulse text-chart-4" />,
      label: 'OCR processing…',
      barColor: 'bg-chart-4',
    },
    success: {
      icon: <CheckCircle2 className="h-4 w-4 text-success" />,
      label: 'Processed successfully',
      barColor: 'bg-success',
    },
    failed: {
      icon: <XCircle className="h-4 w-4 text-destructive" />,
      label: item.error ?? 'Failed',
      barColor: 'bg-destructive',
    },
    idle: {
      icon: <FileIcon className="h-4 w-4 text-muted-foreground" />,
      label: 'Ready',
      barColor: 'bg-muted',
    },
  }[item.status];

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted">
          <FileIcon className="h-5 w-5 text-muted-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{item.fileName}</p>
          <p className="text-xs text-muted-foreground">
            {(item.fileSize / 1024).toFixed(0)} KB
          </p>

          {/* Progress bar */}
          {(item.status === 'uploading' || item.status === 'processing') && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn('h-full rounded-full transition-all duration-300', statusConfig.barColor)}
                style={{ width: `${item.status === 'processing' ? 100 : item.progress}%` }}
              />
            </div>
          )}

          <div className="mt-2 flex items-center gap-1.5">
            {statusConfig.icon}
            <span className="text-xs text-muted-foreground">{statusConfig.label}</span>
          </div>

          {/* Extracted data on success */}
          {item.status === 'success' && item.extractedAmount && (
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-muted/50 p-2.5">
              <div>
                <p className="text-[0.6rem] text-muted-foreground">Amount</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(item.extractedAmount)}
                </p>
              </div>
              <div>
                <p className="text-[0.6rem] text-muted-foreground">Merchant</p>
                <p className="truncate text-sm font-semibold">{item.extractedMerchant}</p>
              </div>
              <div>
                <p className="text-[0.6rem] text-muted-foreground">Date</p>
                <p className="text-sm font-semibold">
                  {item.extractedDate ? formatDate(item.extractedDate, { year: undefined }) : '—'}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          {item.status === 'failed' && (
            <Button size="sm" variant="outline" className="mt-3" onClick={onRetry}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
            </Button>
          )}
        </div>

        {(item.status === 'success' || item.status === 'failed') && (
          <button
            onClick={onRemove}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Remove upload"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

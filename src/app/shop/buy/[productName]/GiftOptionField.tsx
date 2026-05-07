"use client";

export interface GiftOptionFieldProps {
  enabled: boolean;
  wrapping: string;
  message: string;
  onEnabledChange: (enabled: boolean) => void;
  onWrappingChange: (wrapping: string) => void;
  onMessageChange: (message: string) => void;
}

const WRAPPING_OPTIONS = ["通常包装", "リボン包装", "高級包装"] as const;
const GIFT_MESSAGE_ROWS = 3;

interface GiftDetailFieldsProps {
  wrapping: string;
  message: string;
  onWrappingChange: (wrapping: string) => void;
  onMessageChange: (message: string) => void;
}

const GiftDetailFields: React.FC<GiftDetailFieldsProps> = ({ wrapping, message, onWrappingChange, onMessageChange }) => (
  <div className="flex flex-col gap-3 pl-5">
    <div className="flex flex-col gap-1">
      <label htmlFor="gift-wrapping" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        ラッピングの種類
      </label>
      <select
        id="gift-wrapping"
        value={wrapping}
        onChange={(e) => onWrappingChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      >
        {WRAPPING_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <div className="flex flex-col gap-1">
      <label htmlFor="gift-message" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        ギフトメッセージ
      </label>
      <textarea
        id="gift-message"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        rows={GIFT_MESSAGE_ROWS}
        placeholder="メッセージを入力してください"
        className="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      />
    </div>
  </div>
);

export const GiftOptionField: React.FC<GiftOptionFieldProps> = ({
  enabled,
  wrapping,
  message,
  onEnabledChange,
  onWrappingChange,
  onMessageChange,
}) => {
  const enabledInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    type: "checkbox",
    id: "gift-enabled",
    checked: enabled,
    onChange: (e) => onEnabledChange(e.target.checked),
    className: "accent-indigo-600",
  };

  return (
    <fieldset className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <legend className="px-1 text-sm font-semibold text-gray-700 dark:text-gray-300">ギフト設定</legend>
      <label htmlFor="gift-enabled" className="flex cursor-pointer items-center gap-2 text-sm text-gray-800 dark:text-gray-200">
        <input {...enabledInputProps} />
        ギフト包装を利用する
      </label>
      {enabled && (
        <GiftDetailFields wrapping={wrapping} message={message} onWrappingChange={onWrappingChange} onMessageChange={onMessageChange} />
      )}
    </fieldset>
  );
};

GiftOptionField.displayName = "GiftOptionField";

import { FiSmile } from "react-icons/fi";

export default function NoDataPreview({ title }: { title: string }) {
  return (
    <>
      <div className="flex flex-col justify-center gap-2 items-center">
        <FiSmile size={100} className="text-gray-300" />
        <div className="text-black font-medium mt-2">
          You don't have {title}.
        </div>
        <div className="text-gray-300 text-sm">You can always check back</div>
      </div>
    </>
  );
}

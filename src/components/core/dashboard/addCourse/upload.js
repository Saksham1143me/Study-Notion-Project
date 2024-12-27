import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";

const Upload = ({
  name,
  label,
  register,
  setValue,
  errors,
  video,
  viewData = null,
  editData = null,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const file = e.dataTransfer?.files[0];
    if (file) {
      validateAndPreviewFile(file);
    }
  };
  const MAX_FILE_SIZE = 10485760;
  const handleFileInput = (e) => {
    const file = e.target?.files[0];
    if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast("File size exceeds the maximum limit of 10MB.");
          fileInputRef.current.value = ""; // Reset the file input
    }
      validateAndPreviewFile(file);
  };
}

  const validateAndPreviewFile = (file) => {
    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validVideoTypes = ['video/mp4'];
    const validTypes = video ? validVideoTypes : validImageTypes;
    
    if (!validTypes.includes(file.type)) {
      alert(`Please upload a valid ${video ? 'video' : 'image'} file`);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  useEffect(() => {
    if (register) {
      register(name, { required: true });
    }
  }, [register, name]);

  useEffect(() => {
    if (setValue) {
      setValue(name, selectedFile);
    }
  }, [selectedFile, setValue, name]);

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragActive(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <video 
                className="h-full w-full rounded-md" 
                controls
                src={previewSource}
              />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col items-center p-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept={video ? "video/mp4" : "image/jpeg,image/jpg,image/png"}
              className="hidden"
            />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50"/>
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

export default Upload;
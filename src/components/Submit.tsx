type SubmitProps = {
  formId: string;
  submitText?: string;
  disabled?: boolean;
};

const Submit = ({ formId, submitText, disabled }: SubmitProps) => {
  return (
    <>
      <button form={formId} type="submit" className="bg-[#8CD178] block font-medium px-4 py-2 rounded-3xl hover:bg-[#5a8b4c] transition-colors" disabled={disabled}>
        {submitText || "Submit"}
      </button>
    </>
  )
}

export default Submit

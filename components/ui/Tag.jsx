export default function Tag({ tag, onRemove }) {
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-700">
            {tag}
            <button
                onClick={onRemove}
                className="ml-2 hover:text-teal-900"
            >
                ×
            </button>
        </span>
    );
}
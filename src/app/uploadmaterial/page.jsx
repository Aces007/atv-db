import UploadMaterialClient from "./UploadMaterialClient";

export default function UploadPage({ searchParams }) {
    const editId = searchParams.edit || null;

    return <UploadMaterialClient editId={editId} />;
}
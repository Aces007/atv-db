import { useEffect, useState } from "react";
import Link from "next/link";

const AdminButton = ({ userInfo }) => {
  const [isAdmin, setIsAdmin] = useState(userInfo?.is_admin);

  useEffect(() => {
    setIsAdmin(userInfo?.is_admin);
  }, [userInfo]);

  return (
    isAdmin && (
      <Link href={'./admin_approval'}
        className="about_btns font-Montserrat font-bold uppercase">
        Admin Approval
      </Link>
    )
  );
};

export default AdminButton;

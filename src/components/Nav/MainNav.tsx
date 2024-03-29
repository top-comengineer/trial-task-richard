import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/Common/Button";
import { signOut, useSession } from "next-auth/react";
import { useAccount, useDisconnect } from "wagmi";
import { api } from "@/utils/api";
import { toast } from "react-toastify";

const MainNav = () => {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const session = useSession();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const mutation = api.auth.updateWalletAddress.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => toast.success("Successfully Connected."),
  });

  const updatedAddress = async (email: string, walletAddress: string) => {
    const data = {
      email: email,
      address: walletAddress,
    };
    await mutation.mutateAsync(data);
  };

  useEffect(() => {
    if (session?.data?.user?.email && address) {
      updatedAddress(session?.data?.user.email, address);
    }
  }, [address]);

  const handleLogout = () => {
    disconnect();
    signOut();
  };

  return (
    <Fragment>
      <div className="header flex w-full border-b-[1px] border-[#7c7089] px-10 py-4">
        <p className="title uppercase">Defi</p>

        <div className="ml-auto flex gap-2">
          <ConnectButton />

          <Button
            className="bg-[#3898FF] text-white hover:bg-sky-600"
            variant={"none"}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

export default MainNav;

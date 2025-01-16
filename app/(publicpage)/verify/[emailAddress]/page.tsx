import VerifyComponent from "./verifyComponent";

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ emailAddress: string }>;
  searchParams: Promise<{ email_exist: string }>;
}) {
  const emailExist = (await searchParams).email_exist;
  const { emailAddress } = await params;
  const decodedEmail = decodeURIComponent(emailAddress);

  return (
    <>
      <VerifyComponent data={decodedEmail} emailExist={emailExist} />
    </>
  );
}

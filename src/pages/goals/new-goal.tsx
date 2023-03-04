import { useState, useEffect } from "react";
import { useAddress, useContract, Web3Button } from "@thirdweb-dev/react";
import { useFormik } from "formik";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";
import Button from "../../components/Button";
import {
  whitelistedTokens,
  whitelistedTokensByAddress,
} from "../../const/whitelisted-tokens";
import { LENS_GOAL_CONTRACT_ADDRESS } from "../../const/contracts";

export default function NewGoal() {
  const [tokensApproved, setTokensApproved] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const address = useAddress();

  const formik = useFormik({
    initialValues: {
      description: "",
      verificationCriteria: "",
      preProof: "",
      amount: 0,
      deadline: new Date(),
      token: whitelistedTokens["ABC"].address,
      inEther: false,
    },

    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const { contract } = useContract(
    whitelistedTokensByAddress[formik.values.token].address
  );

  function nextStep() {
    setFormStep((step) => step + 1);
  }

  function prevStep() {
    if (formStep === 0) return;
    setFormStep((step) => step - 1);
  }

  function handleDeadilneChange(date: any) {
    formik.handleChange({
      target: {
        id: "deadline",
        name: "deadline",
        value: date,
      },
    });
  }

  useEffect(() => {
    if (!contract) return;

    console.log(address);

    contract.events.addEventListener("Approval", (event) => {
      if (
        event.data.owner === address &&
        event.data.spender === LENS_GOAL_CONTRACT_ADDRESS
      ) {
        setTokensApproved(true);
      }
    });
  }, [contract]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formStep === 0 && (
        <div className="flex w-100 container mx-auto px-8 pt-4">
          <div className="flex grow">
            <div className="w-1/2 flex justify-center">
              <Image
                width={600}
                height={600}
                src="/heroimageLensGoal.png"
                alt=""
              ></Image>
            </div>
            <div className="flex flex-col grow justify-center items-center">
              <div className="mb-8">
                <h2 className="text-center text-3xl">
                  What is your
                  <span className="block">GOAL?</span>
                </h2>
              </div>
              <div className="self-stretch mb-8">
                <textarea
                  id="description"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  rows={5}
                  className="w-full px-4 py-2 text-gray-700 border rounded-lg drop-shadow-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="self-end">
                <Button cb={nextStep} text="NEXT"></Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formStep === 1 && (
        <div className="flex w-100 container mx-auto px-8 pt-4">
          <div className="flex grow">
            <div className="w-1/2 flex justify-center">
              <Image
                width={600}
                height={600}
                src="/heroimageLensGoal.png"
                alt=""
              ></Image>
            </div>
            <div className="flex flex-col grow justify-center items-center">
              <div className="mb-8">
                <h2 className="text-center text-3xl">
                  What will be your
                  <span className="block">PROOF?</span>
                </h2>
              </div>
              <div className="self-stretch mb-8">
                <textarea
                  id="verificationCriteria"
                  name="verificationCriteria"
                  onChange={formik.handleChange}
                  value={formik.values.verificationCriteria}
                  rows={5}
                  className="w-full px-4 py-2 text-gray-700 border rounded-lg drop-shadow-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex self-stretch justify-between">
                <Button cb={prevStep} text="PREV"></Button>
                <Button cb={nextStep} text="NEXT"></Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formStep === 2 && (
        <div className="flex w-100 container mx-auto px-8 pt-4">
          <div className="flex grow">
            <div className="w-1/2 flex justify-center">
              <Image
                width={600}
                height={600}
                src="/heroimageLensGoal.png"
                alt=""
              ></Image>
            </div>
            <div className="flex flex-col grow justify-center items-center">
              <div className="mb-8">
                <h2 className="text-center text-3xl">
                  What date will you achieve this?
                </h2>
              </div>
              <div className="flex justify-center self-stretch mb-8">
                <Calendar
                  onChange={handleDeadilneChange}
                  value={formik.values.deadline}
                />
              </div>
              <div className="flex self-stretch justify-between">
                <Button cb={prevStep} text="PREV"></Button>
                <Button cb={nextStep} text="NEXT"></Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formStep === 3 && (
        <div className="flex w-100 container mx-auto px-8 pt-4">
          <div className="flex grow">
            <div className="w-1/2 flex justify-center">
              <Image
                width={600}
                height={600}
                src="/heroimageLensGoal.png"
                alt=""
              ></Image>
            </div>
            <div className="flex flex-col grow justify-center items-center">
              <div className="mb-8">
                <h2 className="text-center text-3xl">
                  Put you money where your
                  <span className="block">GOAL is</span>
                </h2>
              </div>
              <div className="flex justify-center self-stretch mb-8">
                <div className="flex grow gap-6 justify-between">
                  <div className="flex flex-col grow">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="token"
                    >
                      Choose Token
                    </label>
                    <select
                      id="token"
                      name="token"
                      onChange={formik.handleChange}
                      value={formik.values.token}
                      className="bg-white border-none rounded w-full py-2 px-4 text-gray-700 drop-shadow-lg leading-tight focus:outline-none focus:shadow-outline"
                    >
                      {Object.values(whitelistedTokens).map((token) => {
                        return (
                          <option value={token.address}>{token.symbol}</option>
                        );
                      })}
                      <option value="ETH">ETH</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="amount"
                    >
                      Amount
                    </label>
                    <input
                      className="border-none w-full drop-shadow-lg text-gray-700 mr-3 py-2 px-4 leading-tight focus:outline-none"
                      id="amount"
                      name="amount"
                      type="number"
                      onChange={formik.handleChange}
                      value={formik.values.amount}
                    />
                  </div>
                </div>
              </div>
              <div className="flex self-stretch justify-between">
                <Button cb={prevStep} text="PREV"></Button>
                <Button cb={nextStep} text="NEXT"></Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formStep === 4 && (
        <div className="flex w-100 container mx-auto px-8 pt-4">
          <div className="flex grow">
            <div className="w-1/2 flex justify-center">
              <Image
                width={600}
                height={600}
                src="/heroimageLensGoal.png"
                alt=""
              ></Image>
            </div>
            <div className="flex flex-col grow justify-center items-center">
              <div className="mb-8">
                <h2 className="text-center text-3xl">
                  What will be your
                  <span className="block">PREPROOF?</span>
                </h2>
              </div>
              <div className="self-stretch mb-8">
                <textarea
                  id="preProof"
                  name="preProof"
                  onChange={formik.handleChange}
                  value={formik.values.preProof}
                  rows={5}
                  className="w-full px-4 py-2 text-gray-700 border rounded-lg drop-shadow-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex self-stretch justify-between">
                <Button cb={prevStep} text="PREV"></Button>
                <Button cb={nextStep} text="NEXT"></Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formStep === 5 && formik.values.token !== "ETH" && (
        <div className="flex w-100 container mx-auto px-8 pt-4">
          <div className="flex grow">
            <div className="w-1/2 flex justify-center">
              <Image
                width={600}
                height={600}
                src="/heroimageLensGoal.png"
                alt=""
              ></Image>
            </div>
            <div className="flex flex-col grow justify-center items-center">
              <div className="mb-8">
                {tokensApproved ? (
                  <h2 className="text-center text-3xl">
                    Success! You can now create goal!
                  </h2>
                ) : (
                  <h2 className="text-center text-3xl">
                    Almost finished!
                    <span className="block">
                      Approve LensGoal contract to accept {formik.values.amount}{" "}
                      of yours{" "}
                      {whitelistedTokensByAddress[formik.values.token].symbol}{" "}
                      tokens
                    </span>
                  </h2>
                )}
              </div>
              <div>
                {!tokensApproved && (
                  <Web3Button
                    contractAddress={
                      whitelistedTokensByAddress[formik.values.token].address
                    }
                    action={(contract) => {
                      contract.call(
                        "approve",
                        LENS_GOAL_CONTRACT_ADDRESS,
                        formik.values.amount
                      );
                    }}
                  >
                    Approve
                  </Web3Button>
                )}
              </div>
              <div className="flex self-stretch justify-between">
                <Button cb={prevStep} text="PREV"></Button>
                {tokensApproved && <Button cb={nextStep} text="NEXT"></Button>}
              </div>
            </div>
          </div>
        </div>
      )}
      {(formStep === 6 ||
        (formStep === 5 && formik.values.token === "ETH")) && (
        <div className="flex w-100 container mx-auto px-8 pt-4">
          <div className="flex grow">
            <div className="w-1/2 flex justify-center">
              <Image
                width={600}
                height={600}
                src="/heroimageLensGoal.png"
                alt=""
              ></Image>
            </div>
            <div className="flex flex-col grow justify-center items-center">
              <div className="mb-8">
                <h2 className="text-center text-3xl">That's it!</h2>
              </div>
              <div>
                <Web3Button
                  contractAddress={LENS_GOAL_CONTRACT_ADDRESS}
                  action={(contract) => {
                    contract.call(
                      "makeNewGoal",
                      formik.values.description,
                      formik.values.verificationCriteria,
                      formik.values.token === "ETH" ? true : false,
                      formik.values.amount,
                      formik.values.token,
                      Math.floor(formik.values.deadline.getTime() / 1000),
                      formik.values.preProof
                    );
                  }}
                >
                  Create Goal!
                </Web3Button>
              </div>
              <div className="flex self-stretch justify-between">
                <Button cb={prevStep} text="PREV"></Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

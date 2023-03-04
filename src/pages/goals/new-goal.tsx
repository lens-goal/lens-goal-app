import { useState } from "react";
import { Web3Button } from "@thirdweb-dev/react";
import { useFormik } from "formik";
import Image from "next/image";
import Button from "../../components/Button";

export default function NewGoal() {
  const [formStep, setFormStep] = useState(0);

  const formik = useFormik({
    initialValues: {
      description: "",
      verificationCriteria: "",
      preProof: "",
      amount: 0,
      deadline: 0,
      token: "0x294210dDbC38114dD6EE4959B797A0D2171f220b",
      inEther: false,
    },

    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  function nextStep() {
    setFormStep((step) => step + 1);
  }

  function prevStep() {
    if (formStep === 0) return;
    setFormStep((step) => step - 1);
  }

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
      <div>
        <label htmlFor="preProof">Pre Proof</label>
        <input
          id="preProof"
          name="preProof"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.preProof}
        />
      </div>
      <div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.amount}
        />
      </div>
      <div>
        <label htmlFor="deadline">Deadline</label>
        <input
          id="deadline"
          name="deadline"
          type="number"
          onChange={formik.handleChange}
          value={formik.values.deadline}
        />
      </div>
      <div>
        <label htmlFor="token">Token</label>
        <input
          id="token"
          name="token"
          type="string"
          onChange={formik.handleChange}
          value={formik.values.token}
        />
      </div>
      <div>
        <label htmlFor="inEther">In Ether</label>
        <input
          id="inEther"
          name="inEther"
          type="checkbox"
          onChange={formik.handleChange}
          checked={formik.values.inEther}
        />
      </div>

      <Web3Button
        contractAddress="0x3A3aB8A753d8E490b02941d7Dc86C04Aa392E239"
        action={(contract) => {
          contract.call(
            "makeNewGoal",
            formik.values.description,
            formik.values.verificationCriteria,
            formik.values.inEther,
            formik.values.amount,
            formik.values.token,
            formik.values.deadline,
            formik.values.deadline
          );
        }}
      >
        makeNewGoal
      </Web3Button>
    </form>
  );
}

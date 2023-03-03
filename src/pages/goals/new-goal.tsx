import { Web3Button } from '@thirdweb-dev/react';
import { useFormik } from 'formik';

export default function NewGoal() {
  const formik = useFormik({

    initialValues: {
      description: '',
      verificationCriteria: '',
      preProof: '',
      amount: 0,
      deadline: 0,
      token: '0x294210dDbC38114dD6EE4959B797A0D2171f220b',
      inEther: false
    },

    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },

  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
      <label htmlFor="description">Description</label>
      <input
        id="description"
        name="description"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.description}
        />
        </div>
      <div>
      <label htmlFor="verificationCriteria">Verification Criteria</label>
      <input
        id="verificationCriteria"
        name="verificationCriteria"
        type="text"
        onChange={formik.handleChange}
        value={formik.values.verificationCriteria}
        />
        </div>
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
        contract.call("makeNewGoal", formik.values.description, formik.values.verificationCriteria, formik.values.inEther, formik.values.amount, formik.values.token, formik.values.deadline, formik.values.deadline)
      }}
    >
      makeNewGoal
    </Web3Button>
  

    </form>
  );
  }
import { useEffect, useState } from "react";

function App() {

  const [inputObject , setInputObject] = useState ({
    loanAmount : 0,
    interestRate : 0,
    term : 0,
    extraPayments : 0
  })

  const [CalculateResults , setCalculateResults] = useState(false)

  const [results , setResults] = useState(null)

  const [showDetails , setShowDetails] = useState(false)


    useEffect(() => {
      if (CalculateResults) {

        document.getElementById('resultContainer').classList.add('fade-in');
      }
    }, [CalculateResults]);

  const parsingFunction = (event , field) => {

    const filteredValue = event.replace(/[^0-9,.]/g, "");
    let parsedValue = parseFloat(filteredValue.replace(",", "."));

    if(isNaN(parsedValue)){
      parsedValue = 0
    }

    setInputObject((prevInputObject) => ({
      ...prevInputObject,
      [field]: parsedValue,
    }));
    
  }

  function calculateLoanPaymentsWithExtraPayment(loanAmount, annualInterestRate, loanTermInYears, monthlyExtraPayment) {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const numberOfPayments = loanTermInYears * 12;

    const monthlyPayment =
      (loanAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    let paymentSchedule = [];
    let remainingLoanAmount = loanAmount;

    for (let i = 1; i <= numberOfPayments && remainingLoanAmount > 0; i++) {
      const interestPayment = remainingLoanAmount * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      const totalPayment = monthlyPayment + monthlyExtraPayment;

      paymentSchedule.push({
        month: i,
        monthlyPayment: totalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        remainingLoanAmount: remainingLoanAmount.toFixed(2),
      });

      remainingLoanAmount -= principalPayment + monthlyExtraPayment;

      if (remainingLoanAmount <= 0) {
        remainingLoanAmount = 0;
        break; // Borç bittiğinde döngüyü sonlandır
      }
    }

    const totalInterestPaid = paymentSchedule.reduce((total, payment) => total + parseFloat(payment.interestPayment), 0);
    const totalAmountPaid = totalInterestPaid + loanAmount;

    return {
      paymentSchedule,
      totalInterestPaid: totalInterestPaid.toFixed(2),
      totalAmountPaid: totalAmountPaid.toFixed(2),
      remainingLoanAmount: remainingLoanAmount.toFixed(2),
    };
}

  const Calculate = () => {
    setCalculateResults(true)

    const result = calculateLoanPaymentsWithExtraPayment(
      inputObject.loanAmount,
      inputObject.interestRate,
      inputObject.term,
      inputObject.extraPayments
    );

    setResults(result)
  }  



  let actualTermInYears = (results?.paymentSchedule.length)/12
  let averageInterestPayment = (results?.totalInterestPaid)/(results?.paymentSchedule.length)

  return (
    <div className="h-full overflow-auto">
    <div className="h-full">
      <div className="bg-sky-600 h-20 w-full flex justify-center items-center font-bold text-white">Header</div>
      <div className="bg-emerald-600 h-10 w-full flex justify-center items-center font-bold text-white">Navbar</div>

      <div className="h-full flex">

      <div className="bg-slate-800 w-36 h-screen font-bold text-white hidden justify-center items-center sm:flex">aside</div>

        <div className="flex justify-center items-center w-full">

        <div className="bg-gray-200 md:w-[700px] flex flex-col rounded-md p-3">

        
        <div className="flex flex-col m-2">
          <h1 className="md:text-3xl text-xl font-semibold mb-2 flex justify-center">Enter your loan information</h1>
          <div className='border-gray-400 border'></div>  
          
          <div className="mt-2 w-full">
            <input 
              className="h-12 p-2 rounded-md w-full"
              onChange={(e) => parsingFunction(e.target.value , "loanAmount")}
              placeholder="Loan amount ($)"
            />
          </div>
          <div className="mt-2 w-full">
            <input 
              className="h-12 p-2 rounded-md w-full"
              onChange={(e) => parsingFunction(e.target.value , "interestRate")}
              placeholder="Annual interest rate (%)"
            />
          </div>
          <div className="mt-2 w-full">
            <input 
              className="h-12 p-2 rounded-md w-full"
              onChange={(e) => parsingFunction(e.target.value , "term")}
              placeholder="Length of Term (years)"
            />
          </div>
          <div className="mt-2 w-full">
            <input 
              className="h-12 p-2 rounded-md w-full"
              onChange={(e) => parsingFunction(e.target.value , "extraPayments")}
              placeholder="Extra monthly payment"
            />
          </div>
          <div className="mt-2 w-full">

          </div>

          <button
            className={`bg-sky-600 mt-2 rounded-md w-full h-[45px] font-bold text-white ${
              inputObject?.loanAmount === 0 || inputObject.interestRate === 0 || inputObject.term === 0
              ? "opacity-50"
              : ""
              }`}
              disabled={inputObject?.loanAmount === 0 || inputObject.interestRate === 0 || inputObject.term === 0}
              onClick={(e) => Calculate()}
              >
              Calculate
            </button>

          </div>

           <div id="resultContainer" className={`flex flex-col m-2  ${CalculateResults === false ? 'hidden' : ''}`}>

            <h1 className="md:text-xl text-md font-semibold mb-2 flex justify-center">Find out how much your loan will cost</h1>
            <div className='border-gray-400 border'></div>  

            <div className="flex flex-col items-center mt-2">

              <div className="flex justify-between w-full">
                <div className="flex justify-center items-center font-semibold ">MONTHLY PAYMENT</div>
                <div className="flex justify-center items-center font-sans text-lg">{results?.paymentSchedule[0]?.monthlyPayment}$</div>
              </div>

              <div className="flex justify-between w-full mt-2">
                <div className="flex justify-center items-center font-semibold ">AVERAGE MONTHLY INTEREST</div>
                <div className="flex justify-center items-center font-sans text-lg">{averageInterestPayment.toFixed(2)}$</div>
              </div>

              <div className="flex justify-between w-full mt-2">
                <div className="flex justify-center items-center font-semibold ">TOTAL INTEREST</div>
                <div className="flex justify-center items-center font-sans text-lg">{results?.totalInterestPaid}$</div>
              </div>

              <div className="flex justify-between w-full mt-2">
                <div className="flex justify-center items-center font-semibold ">NUMBER OF YEARS</div>
                <div className="flex justify-center items-center font-sans text-lg">{actualTermInYears.toFixed(2)}$</div>
              </div>

            </div>

            <div className="w-full bg-emerald-900 text-sm flex justify-between text-white rounded-md mt-2">
              <div className="font-bold justify-center items-center w-24 p-4">
                TOTAL BORROWING COST
              </div>
              <div className="flex justify-start items-center w-24 font-bold text-2xl mr-5">
              ${results?.totalAmountPaid}
              </div>
            </div>

            <div 
            className="flex justify-center items-center font-semibold mt-2 text-green-900 underline cursor-pointer"
            onClick={(e) => setShowDetails(!showDetails)}
            >Details</div> 

            <div id="resultContainer" className={`flex justify-center items-center mt-2 ${showDetails === false ? 'hidden' : ''}`}>
              <table className="min-w-full divide-y divide-gray-200 rounded-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">interest Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results?.paymentSchedule?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{item.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.monthlyPayment}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.interestPayment}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.principalPayment}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.remainingLoanAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>


        </div>


        </div>

      </div>

      <div className="w-full bg-cyan-900 font-bold text-white flex justify-center items-center h-20">Footer</div>

    </div>
    </div>
  );
}

export default App;

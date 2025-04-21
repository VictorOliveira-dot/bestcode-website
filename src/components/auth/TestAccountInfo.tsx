
import React from "react";

const TestAccountInfo = () => (
  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
    <h3 className="text-sm font-bold text-yellow-800">Test accounts:</h3>
    <ul className="mt-2 text-sm text-yellow-700 list-disc pl-5">
      <li><strong>Admin:</strong> admin@bestcode.com / admin123</li>
      <li><strong>Professor:</strong> professor@bestcode.com / teacher123</li>
      <li><strong>Aluno:</strong> aluno@bestcode.com / student123</li>
    </ul>
    <p className="mt-2 text-xs text-yellow-600 italic">
      Make sure to type the credentials exactly as shown above.
    </p>
  </div>
);

export default TestAccountInfo;

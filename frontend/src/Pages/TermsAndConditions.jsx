import React from "react";
import Logo from "../assets/logo.png";

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 mb-20 bg-white shadow-lg rounded-lg">
      <img src={Logo} alt="logo" className="w-20 h-20 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <ol className="list-decimal list-inside space-y-4">
        <li>
          <strong>Acceptance of Terms:</strong> By using this website, you agree
          to comply with and be bound by these terms and conditions. If you do
          not agree with any part of these terms, you must not use our services.
        </li>
        <li>
          <strong>User Conduct:</strong> You agree not to use the website for
          any unlawful purpose or in a way that could harm the website, its
          users, or the services provided.
        </li>
        <li>
          <strong>Recipe Submission:</strong> When submitting a recipe, you must
          provide accurate and complete information. You retain the copyright to
          your recipes, but you grant us a non-exclusive, worldwide,
          royalty-free license to use, modify, and publish your content.
        </li>
        <li>
          <strong>Content Ownership:</strong> You are responsible for the
          content you submit. We do not take responsibility for the accuracy or
          legality of your submissions.
        </li>
        <li>
          <strong>Modifications:</strong> We reserve the right to modify these
          terms at any time. It is your responsibility to review these terms
          regularly.
        </li>
        <li>
          <strong>Limitation of Liability:</strong> Our liability is limited to
          the maximum extent permitted by law. We are not liable for any
          indirect or consequential loss or damage arising from your use of the
          website.
        </li>
        <li>
          <strong>Governing Law:</strong> These terms shall be governed by and
          construed in accordance with the laws of [Govt of India]. Any disputes
          arising out of or in connection with these terms shall be subject to
          the exclusive jurisdiction of the courts of [Govt of India].
        </li>
        <li>
          <strong>Contact Information:</strong> For any questions about these
          terms, please contact us at [recipesnap@gmai.com].
        </li>
      </ol>
    </div>
  );
};

export default TermsAndConditions;

import React from 'react'
import styles from './privacy-policy.module.css' // Import the CSS module
import Link from 'next/link' // Import the Link component
import Head from 'next/head'

export default function privacypolicy() {
  return (
    <div className='w-10/12 m-8'>
      <Head>
        <title>Poetry in Motion - Privacy Policy</title>
        <meta
          name='description'
          content='Poetry in Motion is the first creative writing collectible card game in web3. Express your wit and creativity by crafting poetic masterpieces stored on the Sui blockchain.'
        />
      </Head>
      <h1 className='mb-4 text-4xl md:text-6xl tracking-tight'>Privacy Policy</h1>
      Effective date: August 29, 2023
      <br />
      <br />
      <p>
        At Arden, we take your privacy seriously. Please read this Privacy Policy to learn how we
        treat your personal data.
        <strong>
          {' '}
          By using or accessing our Services in any manner, you acknowledge that you accept the
          practices and policies outlined below, and you hereby consent that we will collect, use
          and share your information as described in this Privacy Policy.
        </strong>
        <br />
        <br />
        Remember that your use of Arden&apos;s Services is at all times subject to our Terms of Use,
        <Link className='font-bold underline' href='/terms'>
          {' '}
          Terms of Use
        </Link>
        , which incorporates this Privacy Policy. Any terms we use in this Policy without defining
        them have the definitions given to them in the Terms of Use.
        <br />
        <br />
        As we continually work to improve our Services, we may need to change this Privacy Policy
        from time to time. Upon such changes, we will alert you to any such changes by placing a
        notice on the Arden website, by sending you an email and/or by some other means. Please note
        that if you’ve opted not to receive legal notice emails from us (or you haven’t provided us
        with your email address), those legal notices will still govern your use of the Services,
        and you are still responsible for reading and understanding them. If you use the Services
        after any changes to the Privacy Policy have been posted, that means you agree to all of the
        changes.
      </p>
      <br />
      <br />
      <h2>
        <strong>Privacy Policy Table of Contents</strong>
      </h2>
      <ul>
        <li>
          <a href='#section-1'>What this Privacy Policy Covers</a>
        </li>
        <li>
          <a href='#section-2'>Personal Data</a>
          <ul>
            <li>
              <a href='#section-2-1'>Categories of Personal Data We Collect</a>
            </li>
            <li>
              <a href='#section-2-2'>Categories of Sources of Personal Data</a>
            </li>
            <li>
              <a href='#section-2-3'>
                Our Commercial or Business Purposes for Collecting or Disclosing Personal Data
              </a>
            </li>
          </ul>
        </li>
        <li>
          <a href='#section-3'>How We Disclose Your Personal Data</a>
        </li>
        <li>
          <a href='#section-4'>Tracking Tools, Advertising and Opt-Out</a>
        </li>
        <li>
          <a href='#section-5'>Data Security</a>
        </li>
        <li>
          <a href='#section-6'>Personal Data of Children</a>
        </li>
        <li>
          <a href='#section-7'>Exercising Your Rights under CCPA and VCDPA</a>
        </li>
        <li>
          <a href='#section-8'>Other State Law Privacy Rights</a>
        </li>
        <li>
          <a href='#section-9'>Contact Information</a>
        </li>
      </ul>
      <br />
      <br />
      <br />
      <br />
      <p className='font-light text-2xl'>What this Privacy Policy Covers</p>
      This Privacy Policy covers how we treat Personal Data that we gather when you access or use
      our Services. “Personal Data” means any information that identifies or relates to a particular
      individual and also includes information referred to as “personally identifiable information”
      or “personal information” under applicable data privacy laws, rules or regulations. This
      Privacy Policy does not cover the practices of companies we don’t own or control or people we
      don’t manage.
      <br />
      <br />
      <p className='font-light text-2xl'> Personal Data</p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Examples of Personal Data We Collect</th>
            <th>Categories of Third Parties With Whom We Share this Personal Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Profile or Contact Data</td>
            <td>
              <ul>
                <li>First and last name</li>
                <li>Email</li>
                <li>Phone number</li>
                <li>Unique identifiers such as passwords</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Service Providers</li>
                <li>Parties You Authorize, Access, or Authenticate</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Device/IP Data</td>
            <td>
              <ul>
                <li>IP address</li>
                <li>Device ID</li>
                <li>Domain server</li>
                <li>Type of device/operating system/browser used to access the Services</li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Service Providers</li>
                <li>Analytics Partners</li>
                <li>Parties You Authorize, Access, or Authenticate</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Web Analytics</td>
            <td>
              <ul>
                <li>Web page interactions</li>
                <li>Referring webpage/source through which you accessed the Services</li>
                <li>Non-identifiable request IDs</li>
                <li>
                  Statistics associated with the interaction between device or browser and the
                  Services
                </li>
              </ul>
            </td>
            <td>
              <ul>
                <li>Service Providers</li>
                <li>Analytics Partners</li>
                <li>Parties You Authorize, Access, or Authenticate</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      Categories of Sources of Personal Data <br />
      We collect Personal Data about you from the following categories of sources: <br />
      <ul className={styles.bulletList}>
        <li>You</li>
        <ul className={styles.subBulletList}>
          <li>When you provide such information directly to us.</li>
          <li>When you create an account or use our interactive tools and Services.</li>
          <li>
            When you voluntarily provide information in free-form text boxes through the Services or
            through responses to surveys or questionnaires.
          </li>
          <li>When you send us an email or otherwise contact us.</li>
        </ul>
        <li>When you use the Services and such information is collected automatically.</li>
        <ul className={styles.subBulletList}>
          <li>
            Through Cookies (defined in the “Tracking Tools, Advertising and Opt-Out” section
            below).
          </li>
          <li>
            If you use a location-enabled browser, we may receive information about your location.
          </li>
          <li>
            If you download and install certain applications and software we make available, we may
            receive and collect information transmitted from your computing device for the purpose
            of providing you the relevant Services, such as information regarding when you are
            logged on and available to receive updates or alert notices.
          </li>
        </ul>
      </ul>
      <h2>Third Parties</h2>
      <ul className={styles.bulletList}>
        <li>Vendors</li>
        <ul className={styles.subBulletList}>
          <li>
            We may use analytics providers to analyze how you interact and engage with the Services,
            or third parties may help us provide you with customer support.
          </li>
        </ul>
      </ul>
      <br />
      Our Commercial or Business Purposes for Collecting or Disclosing Personal Data <br />
      · Providing, Customizing and Improving the Services <br />
      o Creating and managing your account or other user profiles. <br />
      o Processing orders or other transactions; billing. <br />o Providing you with the products,
      services or information you request. <br />o Meeting or fulfilling the reason you provided the
      information to us. <br />
      o Providing support and assistance for the Services. <br />
      o Improving the Services, including testing, research, internal analytics and product
      development. <br />o Personalizing the Services, website content and communications based on
      your preferences. <br />
      o Doing fraud protection, security and debugging. <br />
      o Carrying out other business purposes stated when collecting your Personal Data or as
      otherwise set forth in applicable data privacy laws, such as the California Consumer Privacy
      Act, as amended by the California Privacy Rights Act of 2020 (the “CCPA”).
      <br />· Marketing the Services <br />
      o Marketing and selling the Services. <br />o Showing you advertisements, including
      interest-based or online behavioral advertising. <br />
      · Corresponding with You <br />
      <br />o Responding to correspondence that we receive from you, contacting you when necessary
      or requested, and sending you information about Arden or the Services. o Sending emails and
      other communications according to your preferences or that display content that we think will
      interest you. <br />
      · Meeting Legal Requirements and Enforcing Legal Terms <br />
      o Fulfilling our legal obligations under applicable law, regulation, court order or other
      legal process, such as preventing, detecting and investigating security incidents and
      potentially illegal or prohibited activities.
      <br />o Protecting the rights, property or safety of you, Arden or another party. <br />
      o Enforcing any agreements with you. <br />
      o Responding to claims that any posting or other content violates third-party rights. <br />
      o Resolving disputes. <br />
      <br /> <br />
      We will not collect additional categories of Personal Data or use the Personal Data we
      collected for materially different, unrelated or incompatible purposes without providing you
      notice.
      <br />
      <br />
      <p className='font-light text-2xl'>How We Disclose Your Personal Data</p>
      We disclose your Personal Data to the categories of service providers and other parties listed
      in this section. Depending on state laws that may be applicable to you, some of these
      disclosures may constitute a “sale” of your Personal Data. For more information, please refer
      to the state-specific sections below. Service Providers. These parties help us provide the
      Services or perform business functions on our behalf. They include:
      <br />
      Hosting, technology and communication providers.
      <br />
      Security and fraud prevention consultants.
      <br />
      Payment processors.
      <br />
      Our payment processing partner Stripe, Inc. (“Stripe”) collects your voluntarily-provided
      payment card information necessary to process your payment.
      <br />
      Please see Stripe’s terms of service and privacy policy for information on its use and storage
      of your Personal Data.
      <br />
      Analytics Partners. These parties provide analytics on web traffic or usage of the Services.
      They include:
      <br />
      Companies that track how users found or were referred to the Services.
      <br />
      Companies that track how users interact with the Services.
      <br />
      Parties You Authorize, Access or Authenticate
      <br />
      Third parties you access through the services.
      <br />
      Social media services.
      <br />
      Other users.
      <br />
      <br />
      <br />
      <p className='font-light text-2xl'> Legal Obligations</p>
      We may share any Personal Data that we collect with third parties in conjunction with any of
      the activities set forth under “Meeting Legal Requirements and Enforcing Legal Terms” in the
      “Our Commercial or Business Purposes for Collecting Personal Data” section above.
      <br />
      <br />
      <p className='font-light text-2xl'> Business Transfers</p>
      All of your Personal Data that we collect may be transferred to a third party if we undergo a
      merger, acquisition, bankruptcy or other transaction in which that third party assumes control
      of our business (in whole or in part). Should one of these events occur, we will make
      reasonable efforts to notify you before your information becomes subject to different privacy
      and security policies and practices.
      <br />
      <br />
      <p className='font-light text-2xl'> Data that is Not Personal Data</p>
      We may create aggregated, de-identified or anonymized data from the Personal Data we collect,
      including by removing information that makes the data personally identifiable to a particular
      user. We may use such aggregated, de-identified or anonymized data and share it with third
      parties for our lawful business purposes, including to analyze, build and improve the Services
      and promote our business, provided that we will not share such data in a manner that could
      identify you.
      <br />
      <br />
      <p className='font-light text-2xl'>Tracking Tools, Advertising and Opt-Out</p>
      The Services may use cookies and similar technologies such as pixel tags, web beacons, clear
      GIFs and JavaScript (collectively, “Cookies”) to enable our servers to recognize your web
      browser, tell us how and when you visit and use our Services, analyze trends, learn about our
      user base and operate and improve our Services. Cookies are small pieces of data– usually text
      files – placed on your computer, tablet, phone or similar device when you use that device to
      access our Services. We may also supplement the information we collect from you with
      information received from third parties, including third parties that have placed their own
      Cookies on your device(s). We may use the following types of Cookies:
      <br />
      <br />· Essential Cookies. Essential Cookies are required for providing you with features or
      services that you have requested. For example, certain Cookies enable you to log into secure
      areas of our Services. Disabling these Cookies may make certain features and services
      unavailable.
      <br />· Functional Cookies. Functional Cookies are used to record your choices and settings
      regarding our Services, maintain your preferences over time and recognize you when you return
      to our Services. These Cookies help us to personalize our content for you, greet you by name
      and remember your preferences (for example, your choice of language or region).
      <br />· Performance/Analytical Cookies. Performance/Analytical Cookies allow us to understand
      how visitors use our Services. They do this by collecting information about the number of
      visitors to the Services, what pages visitors view on our Services and how long visitors are
      viewing pages on the Services. Performance/Analytical Cookies also help us measure the
      performance of our advertising campaigns in order to help us improve our campaigns and the
      Services’ content for those who engage with our advertising.
      <br />
      You can decide whether or not to accept Cookies through your internet browser’s settings. Most
      browsers have an option for turning off the Cookie feature, which will prevent your browser
      from accepting new Cookies, as well as (depending on the sophistication of your browser
      software) allow you to decide on acceptance of each new Cookie in a variety of ways. You can
      also delete all Cookies that are already on your device. If you do this, however, you may have
      to manually adjust some preferences every time you visit our website and some of the Services
      and functionalities may not work.
      <br />
      To explore what Cookie settings are available to you, look in the “preferences” or “options”
      section of your browser’s menu. To find out more information about Cookies, including
      information about how to manage and delete Cookies, please visit
      https://ico.org.uk/for-the-public/online/cookies/ or http://www.allaboutcookies.org/.
      <br />
      <br />
      <br />
      <p className='font-light text-2xl'> Data Security </p>
      We seek to protect your Personal Data from unauthorized access, use and disclosure using
      appropriate physical, technical, organizational and administrative security measures based on
      the type of Personal Data and how we are processing that data. You should also help protect
      your data by appropriately selecting and protecting your password and/or other sign-on
      mechanism; limiting access to your computer or device and browser; and signing off after you
      have finished accessing your account. Although we work to protect the security of your account
      and other data that we hold in our records, please be aware that no method of transmitting
      data over the internet or storing data is completely secure.
      <br />
      <br />
      <p className='font-light text-2xl'> Data Retention</p>
      We retain Personal Data about you for as long as necessary to provide you with our Services or
      to perform our business or commercial purposes for collecting your Personal Data. When
      establishing a retention period for specific categories of data, we consider who we collected
      the data from, our need for the Personal Data, why we collected the Personal Data, and the
      sensitivity of the Personal Data. In some cases we retain Personal Data for longer, if doing
      so is necessary to comply with our legal obligations, resolve disputes or collect fees owed,
      or is otherwise permitted or required by applicable law, rule or regulation. We may further
      retain information in an anonymous or aggregated form where that information would not
      identify you personally.
      <br />
      <br />
      <p className='font-light text-2xl'> Personal Data of Children </p>
      As noted in the Terms of Use, we do not knowingly collect or solicit Personal Data from
      children under 13 years of age; if you are a child under the age of 13, please do not attempt
      to register for or otherwise use the Services or send us any Personal Data. If we learn we
      have collected Personal Data from a child under 13 years of age, we will delete that
      information as quickly as possible. If you believe that a child under 13 years of age may have
      provided Personal Data to us, please contact us at support@arden.cc.
      <br />
      <br />
      <p className='font-light text-2xl'> State Law Privacy Rights </p>
      California Resident Rights Under California Civil Code Sections 1798.83-1798.84, California
      residents are entitled to contact us to prevent disclosure of Personal Data to third parties
      for such third parties’ direct marketing purposes; in order to submit such a request, please
      contact us at support@arden.cc. Your browser may offer you a “Do Not Track” option, which
      allows you to signal to operators of websites and web applications and services that you do
      not wish such operators to track certain of your online activities over time and across
      different websites. Our Services do not support Do Not Track requests at this time. To find
      out more about “Do Not Track,” you can visit www.allaboutdnt.com. Nevada Resident Rights If
      you are a resident of Nevada, you have the right to opt-out of the sale of certain Personal
      Data to third parties. You can exercise this right by contacting us at support@arden.cc with
      the subject line “Nevada Do Not Sell Request” and providing us with your name and the email
      address associated with your account. Please note that we do not currently sell your Personal
      Data as sales are defined in Nevada Revised Statutes Chapter 603A.
      <br />
      <br />
      <p className='font-light text-2xl'> Contact Information:</p>
      If you have any questions or comments about this Privacy Policy, the ways in which we collect
      and use your Personal Data or your choices and rights regarding such collection and use,
      please do not hesitate to contact us at:
      <br />
      arden.cc
      <br />
      support@arden.cc
      <br />
      <br />
      <br />
      <br />
    </div>
  )
}

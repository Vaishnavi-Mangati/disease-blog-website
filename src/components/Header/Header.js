import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'

export default function Header() {
  // const menuItems = ['Home', 'About', 'Projects', 'Services', 'Contact']

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/appLogo.png" alt="Logo" width={120} height={120} />
        </Link>
      </div>

      <div className={styles.menu}>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>Health conditions</button>
          <div className={styles.dropdownContent}>
            <Link href="/">Option1</Link>
            <Link href="/">Option2</Link>
            <Link href="/">Option3</Link>
          </div>
        </div>

        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>Wellbeing</button>
          <div className={styles.dropdownContent}>
            <Link href="/">Option1</Link>
            <Link href="/">Option2</Link>
            <Link href="/">Option3</Link>
          </div>
        </div>

        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>Tools</button>
          <div className={styles.dropdownContent}>
            <Link href="/">Option1</Link>
            <Link href="/">Option2</Link>
            <Link href="/">Option3</Link>
          </div>
        </div>

        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>Featured</button>
          <div className={styles.dropdownContent}>
            <Link href="/">Option1</Link>
            <Link href="/">Option2</Link>
            <Link href="/">Option3</Link>
          </div>
        </div>

        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>Connect</button>
          <div className={styles.dropdownContent}>
            <Link href="/">Option1</Link>
            <Link href="/">Option2</Link>
            <Link href="/">Option3</Link>
          </div>
        </div>
      </div>



      <div className={styles.subscribe}>
        <button className={styles.subscribeBtn}>Subscribe</button>
      </div>
    </div>
  )
}






// {menuItems.map((item) => (
//           <div className={styles.dropdown} key={item}>
//             <button className={styles.dropbtn}>{item}</button>
//             <div className={styles.dropdownContent}>
//               <Link href={`/${item.toLowerCase()}/option1`}>Health conditions</Link>
//               <Link href={`/${item.toLowerCase()}/option2`}>Well-Being</Link>
//               <Link href={`/${item.toLowerCase()}/option3`}>Tools</Link>
//             </div>
//           </div>
//         ))}
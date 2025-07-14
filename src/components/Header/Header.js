import Image from 'next/image'
import Link from 'next/link'
import styles from './header.module.css'

export default function Header() {
  const menuItems = ['Home', 'About', 'Projects', 'Services', 'Contact']

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <Image src="/appLogo.png" alt="Logo" width={100} height={50} />
        </Link>
      </div>

      <div className={styles.menu}>
        {menuItems.map((item) => (
          <div className={styles.dropdown} key={item}>
            <button className={styles.dropbtn}>{item}</button>
            <div className={styles.dropdownContent}>
              <Link href={`/${item.toLowerCase()}/option1`}>Option 1</Link>
              <Link href={`/${item.toLowerCase()}/option2`}>Option 2</Link>
              <Link href={`/${item.toLowerCase()}/option3`}>Option 3</Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.subscribe}>
        <button className={styles.subscribeBtn}>Subscribe</button>
      </div>
    </div>
  )
}

import settingIcon from '../assets/images/icons/settings.svg'
import padaiIcon from '../assets/images/icons/padai.svg'
import notificationIcon from "../assets/images/icons/notification.svg"
import { useSidebarStore } from '../store/sidebarStore';

export default function Header() {
    const { toggleSidebar } = useSidebarStore();

    return (
        <>
            <header id="top-navbar" className="top-navbar">
                <div className="container">
                    <div className="top-navbar_full">
                        <div className="back-btn">
                            <a className='cursor-pointer' onClick={() => toggleSidebar()}>
                                <img src={settingIcon} alt="" width={24} height={24} />
                            </a>
                        </div>
                        <div className="top-navbar-title">
                            <img src={padaiIcon} alt="" width={50} height={30} />

                        </div>
                        <div className="skip-btn-goal">
                            <a  className='hidden'>
                                <img src={notificationIcon} alt="" width={24} height={24} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="navbar-boder"></div>
            </header>
        </>
    )
}

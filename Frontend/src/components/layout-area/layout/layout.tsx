import { AuthMenu } from "../../user-area/auth-menu/auth-menu";
import { Copyrights } from "../copyrights/copyrights";
import { Header } from "../header/header";
import { Menu } from "../menu/menu";
import { Routing } from "../routing/routing";
import "./layout.css";

export function Layout() {
    return (
        <div className="Layout">

			<header>
                <Header />
                <AuthMenu />
            </header>

            <nav>
                <Menu />
            </nav>

            <main>
                <Routing />
            </main>

            <footer>
                <Copyrights />
            </footer>

        </div>
    );
}

import React from 'react';
import render from '../app-target';
import versionInfo from './version.json';

import {APP_NAME} from '../../lib/constants/brand';
import {detectTheme} from '../../lib/themes/themePersistance';

const theme = detectTheme();
document.documentElement.setAttribute('data-theme', theme.id || (theme.isDark ? 'dark' : 'light'));
document.documentElement.lang = 'en';

const About = () => (
    <>
        <style>{`
            :root,
            [data-theme="dark"] {
                --bg-color: #1a1a2e;
                --text-color: #e4e4e7;
                --accent-color: #75C1C4;
                --secondary-bg: #252542;
                --card-bg: rgba(37, 37, 66, 0.8);
                --border-color: rgba(117, 193, 196, 0.2);
                --hover-bg: rgba(117, 193, 196, 0.1);
            }

            [data-theme="light"] {
                --bg-color: #f8fafc;
                --text-color: #1e293b;
                --accent-color: #75C1C4;
                --secondary-bg: #e2e8f0;
                --card-bg: rgba(255, 255, 255, 0.95);
                --border-color: rgba(117, 193, 196, 0.3);
                --hover-bg: rgba(117, 193, 196, 0.08);
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                background: var(--bg-color);
                background-image: 
                    radial-gradient(circle at 20% 80%, rgba(117, 193, 196, 0.05) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(117, 193, 196, 0.03) 0%, transparent 50%),
                    radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                background-size: 100% 100%, 100% 100%, 32px 32px;
                font-family: "Inter", system-ui, -apple-system, "Segoe UI", "Helvetica Neue", "Noto Sans", Helvetica, Arial, sans-serif;
                color: var(--text-color);
                line-height: 1.6;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            [data-theme="light"] body {
                background-image: 
                    radial-gradient(circle at 20% 80%, rgba(117, 193, 196, 0.08) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(117, 193, 196, 0.05) 0%, transparent 50%),
                    radial-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px);
            }

            main {
                max-width: 680px;
                width: 100%;
            }

            .card {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 24px;
                padding: 3rem;
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(117, 193, 196, 0.1);
                position: relative;
                overflow: hidden;
            }

            .header {
                margin-bottom: 2rem;
                text-align: center;
            }

            h1 {
                font-size: 2.5rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                margin-top: 0;
                margin-bottom: 0.5rem;
                background: linear-gradient(135deg, var(--accent-color), #98D8C8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 12px;
            }

            .version {
                font-size: 1rem;
                font-weight: 600;
                background: linear-gradient(135deg, var(--accent-color), #5AB8BA);
                color: #fff;
                -webkit-text-fill-color: #fff;
                padding: 0.3rem 1rem;
                border-radius: 40px;
                letter-spacing: normal;
                font-family: 'SF Mono', 'Fira Code', monospace;
                box-shadow: 0 4px 12px rgba(117, 193, 196, 0.3);
            }

            .more-version {
                font-size: 0.875rem;
                color: rgba(255, 255, 255, 0.6);
                font-family: 'SF Mono', 'Fira Code', monospace;
                background: var(--secondary-bg);
                display: inline-block;
                padding: 0.3rem 1rem;
                margin: 0.75rem 0 1.5rem 0;
                border-radius: 32px;
                border: 1px solid var(--border-color);
            }

            [data-theme="light"] .more-version {
                color: rgba(0, 0, 0, 0.5);
            }

            .content {
                margin-bottom: 2rem;
            }

            p {
                margin: 1rem 0;
                font-weight: 450;
                color: var(--text-color);
                font-size: 1.05rem;
                opacity: 0.9;
            }

            p:first-child {
                margin-top: 0;
            }

            p:last-child {
                margin-bottom: 0;
            }

            a {
                color: var(--accent-color);
                text-decoration: none;
                font-weight: 600;
                border-bottom: 2px solid transparent;
                transition: all 0.25s ease;
                padding-bottom: 2px;
            }

            a:hover {
                color: #98D8C8;
                border-bottom-color: var(--accent-color);
            }

            .links {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                justify-content: center;
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid var(--border-color);
            }

            .btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 0.75rem 1.5rem;
                border-radius: 12px;
                font-weight: 600;
                font-size: 0.95rem;
                transition: all 0.25s ease;
                text-decoration: none;
                border: none;
                cursor: pointer;
            }

            .btn-primary {
                background: linear-gradient(135deg, var(--accent-color), #5AB8BA);
                color: #fff;
                box-shadow: 0 4px 15px rgba(117, 193, 196, 0.3);
            }

            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(117, 193, 196, 0.4);
            }

            .btn-secondary {
                background: var(--secondary-bg);
                color: var(--text-color);
                border: 1px solid var(--border-color);
            }

            .btn-secondary:hover {
                background: var(--hover-bg);
                border-color: var(--accent-color);
                transform: translateY(-2px);
            }

            @media (max-width: 720px) {
                body {
                    padding: 1rem;
                }

                .card {
                    padding: 2rem 1.5rem;
                    border-radius: 20px;
                }

                h1 {
                    font-size: 2rem;
                }

                .links {
                    flex-direction: column;
                }

                .btn {
                    justify-content: center;
                }
            }

            @media (max-width: 560px) {
                .card {
                    padding: 1.5rem;
                    border-radius: 16px;
                }

                h1 {
                    font-size: 1.75rem;
                    flex-direction: column;
                    gap: 8px;
                }
            }
        `}</style>
        <main>
            <div className="card">
                <div className="header">
                    <h1>{APP_NAME} About <span className="version">v{versionInfo.version}_{versionInfo.version_little}</span></h1>
                    <p className="more-version">{`Latest updated: ${versionInfo['latest-date']}`}</p>
                </div>
                <div className="content">
                    <p>
                        {APP_NAME} is a better offline editor for Scratch 3. It enhances your Scratch experience with advanced features and optimizations.
                    </p>
                    <p>
                        Learn more at <a href="https://www.bugwarp.org/">https://www.bugwarp.org/</a>.
                    </p>
                    <p>
                        {APP_NAME} is licensed under the GNU General Public License v3.0.
                        The source code is published <a href="https://github.com/BugWarp/" target="_blank" rel="noreferrer">on GitHub</a>.
                    </p>
                    <p>
                        About more updates, please visit at <a href="https://github.com/BugWarp/">GitHub</a>.
                    </p>
                </div>
                {/* <div className="links">
                    <a href="https://www.bugwarp.org/" className="btn btn-primary" target="_blank" rel="noreferrer">
                        Visit Website
                    </a>
                    <a href="https://github.com/BugWarp/" className="btn btn-secondary" target="_blank" rel="noreferrer">
                        GitHub
                    </a>
                     <a href="mailto:support@bugwarp.org" className="btn btn-secondary">
                        Contact Us
                    </a> 
                </div>  */}
            </div>
        </main>
    </>
);

render(<About />);

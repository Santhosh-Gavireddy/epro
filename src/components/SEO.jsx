import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
    useEffect(() => {
        // Update Title
        const siteTitle = 'E-Pro Store';
        const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
        document.title = fullTitle;

        // Helper to update meta tags
        const updateMeta = (name, content, attribute = 'name') => {
            if (!content) return;
            let element = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Update Meta Tags
        const metaDescription = description || 'Premium fashion and lifestyle store.';
        const metaKeywords = keywords || 'fashion, clothing, men, women, kids, accessories';
        const metaImage = image || '/logo.png'; // Make sure a default logo exists or use a placeholder
        const metaUrl = url || window.location.href;

        updateMeta('description', metaDescription);
        updateMeta('keywords', metaKeywords);

        // Open Graph
        updateMeta('og:type', 'website', 'property');
        updateMeta('og:url', metaUrl, 'property');
        updateMeta('og:title', fullTitle, 'property');
        updateMeta('og:description', metaDescription, 'property');
        updateMeta('og:image', metaImage, 'property');

        // Twitter
        updateMeta('twitter:card', 'summary_large_image', 'property');
        updateMeta('twitter:url', metaUrl, 'property');
        updateMeta('twitter:title', fullTitle, 'property');
        updateMeta('twitter:description', metaDescription, 'property');
        updateMeta('twitter:image', metaImage, 'property');

    }, [title, description, keywords, image, url]);

    return null; // This component doesn't render anything visible
};

export default SEO;

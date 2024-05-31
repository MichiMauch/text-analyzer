import React, { useState } from 'react';

interface FormProps {
  onSubmit: (url: string, keyphrase: string) => void;
  loading: boolean;
}

const Form: React.FC<FormProps> = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');
  const [keyphrase, setKeyphrase] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, keyphrase);
  };

  return (
    <div className="border bg-background rounded-xl my-4 p-4">
      <h1 className="text-3xl font-bold">Paul AI by MM</h1>
      <div className="border-t mt-4 pt-4">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col mb-4">
            <label htmlFor="url" className="text-xs mb-2">Analyze your website:</label>
            <input
              type="text"
              id="url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="px-4 py-2 border rounded-md w-full"
              placeholder="www.example.com"
            />
          </div>
          <div className="flex flex-col flex-grow mb-4">
            <label htmlFor="keyphrase" className="text-xs mb-2">Keyphrase:</label>
            <div className="flex items-end space-x-4">
              <input
                type="text"
                id="keyphrase"
                name="keyphrase"
                value={keyphrase}
                onChange={(e) => setKeyphrase(e.target.value)}
                required
                className="px-4 py-2 border rounded-md flex-grow"
                placeholder="Drupal 10"
              />
              <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-md" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;

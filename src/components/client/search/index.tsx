import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWindowSize, useDebounce } from 'react-use';
import useApi from '@/lib/client/services/useAPI';
import { fetchPosition } from '@/lib/client/services/apiService';
import { setPositions } from '@/lib/client/store/slices/positionSlice';
import SearchPanelMobile from './SearchPanelMobile';
import SearchPanel from './searchPanel';
import { mapPositionWithSlug } from '@/lib/utils';
import EmptyState from '../common/EmptyState';
import { useTranslations } from 'next-intl';

const Search = () => {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const tInfo = useTranslations('Info');
  useDebounce(() => setIsMobile(width <= 768), 100, [Math.floor(width / 10)]);

  const { data, error, isLoading } = useApi('/api/vi-tri', () =>
    fetchPosition()
  );

  const positions = useMemo(() => {
    return data ? mapPositionWithSlug(data) : [];
  }, [data]);

  useEffect(() => {
    if (positions.length > 0) {
      dispatch(setPositions(positions));
    }
  }, [positions, dispatch]);

  if (error) {
    return <EmptyState title={tInfo('no_position')} />;
  }

  return isMobile ? (
    <SearchPanelMobile isLoading={isLoading} />
  ) : (
    <SearchPanel isLoading={isLoading} />
  );
};

export default Search;
